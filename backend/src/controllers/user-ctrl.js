const User = require("../db/models/user-model");
const GeneralCtrl = require("./general-ctrl");
const Validator = require("validator");
const isEmpty = require("is-empty");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secretOrKey } = require("../config/config");

function validateRegisterInput(data) {
    let errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.confirmPass = !isEmpty(data.confirmPass) ? data.confirmPass : "";
    // Name checks
    if (Validator.isEmpty(data.username)) {
        errors.username = "Username field is required";
    }
    // Email checks
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }
    // Password checks
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    if (Validator.isEmpty(data.confirmPass)) {
        errors.confirmPass = "Confirm password field is required";
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }
    if (!Validator.equals(data.password, data.confirmPass)) {
        errors.confirmPass = "Passwords must match";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
}

function validateLoginInput(data) {
    let errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    // Email checks
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }
    // Password checks
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
}

function convertToName(name) {
    conName = name.replace("%27", "'");
    conName = conName.replace("_", " ");
    return conName;
}

function addObjects(...objs) {
    let retObj = objs.reduce((req1, req2) => {
        for (key in req2) {
            if (key in req1) {
                for(let i=0; i<req2[key].length; i++) {
                    let curMat = GeneralCtrl.searchArray(req2[key][i].name, req1[key]);
                    if (curMat === null) {
                        req1[key].push(req2[key][i]);
                    } else {
                        if ("matList" in curMat) {
                            for (let j=0; j<curMat.matList.length; j++) {
                                curMat.matList[j].reqNum += req2[key][i].matList[j].reqNum;
                            }
                        } else {
                            curMat.reqNum += req2[key][i].reqNum;
                        }
                    }
                }
            } else {
                req1[key] = req2[key];
            }
        }
        return req1;
    });

    return retObj;
}

function conUserData() {

}

createUser = (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        }

        let data = {
            charList: [],
            weaponList: [],
            materials: {},
        }

        const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        userData: data,
        });
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            });
        });
    });
}

loginUser = (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(async isMatch => {
            if (isMatch) {
                let materials = GeneralCtrl.generalData.materials;
                let userData = user.userData.materials;

                for (let key in materials) {
                    if (key in userData) {
                        for (let i=0; i<materials[key].length; i++) {
                            if ("type" in materials[key][i]) {
                                let curMat = GeneralCtrl.searchArray(materials[key][i].name, userData[key]);
                                let imgPath = GeneralCtrl.searchArray(materials[key][i].name, GeneralCtrl.generalData.img).imgPath;
                                if (curMat !== null) {
                                    curMat.imgPath = imgPath;
                                    if (key === "weaponExp" || key === "charExp") {
                                        curMat.exp = materials[key][i].exp;
                                    }
                                } else {
                                    let insert = {
                                        ...materials[key][i],
                                        number: 0,
                                        imgPath: imgPath,
                                    };
                                    userData[key].push(insert);
                                }
                            } else {
                                let curMatShort = GeneralCtrl.searchArray(materials[key][i].name, userData[key]);
                                if (curMatShort !== null) {
                                    for (let type in materials[key][i]) {
                                        if (type !== "name" && materials[key][i][type] !== null) {
                                            let curMat = GeneralCtrl.searchArray(materials[key][i][type], curMatShort.matList);
                                            let imgPath = GeneralCtrl.searchArray(materials[key][i][type], GeneralCtrl.generalData.img).imgPath;
                                            if (curMat !== null) {
                                                curMat.imgPath = imgPath;
                                            } else {
                                                let insert = {
                                                    name: materials[key][i][type],
                                                    type: type,
                                                    number: 0,
                                                    imgPath: imgPath,
                                                };
                                                curMatShort.matList.push(insert);
                                            }
                                        }
                                    }
                                } else {
                                    let insert = {
                                        name: materials[key][i].name,
                                        matList: [],
                                    };
                                    for (let type in materials[key][i]) {
                                        if (type !== "name" && materials[key][i][type] !== null) {
                                            let imgPath = GeneralCtrl.searchArray(materials[key][i][type], GeneralCtrl.generalData.img).imgPath;
                                            let matInsert = {
                                                name: materials[key][i][type],
                                                type: type,
                                                number: 0,
                                                imgPath: imgPath,
                                            };
                                            insert.matList.push(matInsert);
                                        }
                                    }
                                    userData[key].push(insert);
                                }
                            }
                        }
                    } else {
                        userData[key] = [];
                        for (let i=0; i<materials[key].length; i++) {
                            if ("type" in materials[key][i]) {
                                let imgPath = GeneralCtrl.searchArray(materials[key][i].name, GeneralCtrl.generalData.img).imgPath;
                                let insert = {
                                    ...materials[key][i],
                                    number: 0,
                                    imgPath: imgPath,
                                };
                                userData[key].push(insert);
                            } else {
                                let insert = {
                                    name: materials[key][i].name,
                                    matList: [],
                                };
                                for (let type in materials[key][i]) {
                                    if (type !== "name" && materials[key][i][type] !== null) {
                                        let imgPath = GeneralCtrl.searchArray(materials[key][i][type], GeneralCtrl.generalData.img).imgPath;
                                        let matInsert = {
                                            name: materials[key][i][type],
                                            type: type,
                                            number: 0,
                                            imgPath: imgPath,
                                        };
                                        insert.matList.push(matInsert);
                                    }
                                }
                                userData[key].push(insert);
                            }
                        }
                    }
                    
                }

                await User.updateOne({ email: user.email }, { $set: { "userData.materials": userData } });
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    email: user.email,
                };
                // Sign token
                jwt.sign(payload, secretOrKey, { expiresIn: 31556926 }, (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    });
                });
            } else {

                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}

checkToken = (req, res, next) => {
    const header = req.headers["authorization"];

    if (typeof header !== "undefined") {
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token;
    } else {
        req.token = "Unauthorized";
    }

    next();
}

// Update or create user data
updateUserData = (req, res) => {
    if (req.token === "Unauthorized") {
        return res.status(401).json({ error: "Unauthorized"});
    }

    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            return res.status(500).json({ error: "Could not connect"});
        }

        let newData = req.body.userData;

        if ("weaponList" in newData) {
            for (let i=0; i<newData.weaponList.length; i++) {
                if ("imgPath" in newData.weaponList[i]) continue;
                newData.weaponList[i]["imgPath"] = GeneralCtrl.searchArray(newData.weaponList[i].name, GeneralCtrl.generalData.img).imgPath;
            }
        }

        if ("charList" in newData) {
            for (let i=0; i<newData.charList.length; i++) {
                if (!("imgPath" in newData.charList[i].autoAttack)) {
                    newData.charList[i].autoAttack["imgPath"] = GeneralCtrl.searchArray(newData.charList[i].autoAttack.name, GeneralCtrl.generalData.img).imgPath;
                }
                if (!("imgPath" in newData.charList[i].eleSkill)) {
                    newData.charList[i].eleSkill["imgPath"] = GeneralCtrl.searchArray(newData.charList[i].eleSkill.name, GeneralCtrl.generalData.img).imgPath;
                }
                if (!("imgPath" in newData.charList[i].eleBurst)) {
                    newData.charList[i].eleBurst["imgPath"] = GeneralCtrl.searchArray(newData.charList[i].eleBurst.name, GeneralCtrl.generalData.img).imgPath;
                }
                if ("imgPath" in newData.charList[i]) continue;
                newData.charList[i]["imgPath"] = GeneralCtrl.searchArray(newData.charList[i].name, GeneralCtrl.generalData.img).imgPath;
            }
        }

        User.updateOne(
            { email: data.email },
            { $set: { userData: newData } }
        )
            .then(() => res.json({ success: true }))
            .catch(err => {
                console.log(err);
                return res.json({ error: "Could not update user data" })
            });
    });
}

// Get user data
getUserData = (req, res) => {
    if (req.token === "Unauthorized") {
        return res.status(401).json({ error: "Unauthorized"});
    }

    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            return res.status(500).json({ error: "Could not connect"});
        }
        User.findOne({ email: data.email }).then(user => {
            return res.json({ userData: user.userData });
        });
    });
}

// Get list of characters, materials, weapons
getGeneralData = (req, res) => {
    let generalData = GeneralCtrl.generalData;
    let send = {
        charList: generalData.charList,
        weaponList: generalData.weaponList,
        materials: generalData.materials, 
    }
    res.json(send);
}

// Gets all requirements for all weapons, characters, and talents
getAllReq = (req, res) => {
    if (req.token === "Unauthorized") {
        return res.status(401).json({ error: "Unauthorized"});
    }

    //return res.json(GeneralCtrl.getAllCharReq([{name: "Amber", curLvl: 1, reqLvl: 90}]));
    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Could not connect"});
        }
        User.findOne({ email: data.email }).then(user => {
            let charReq = GeneralCtrl.getAllCharReq(user.userData.charList);
            let weaponReq = GeneralCtrl.getAllWeaponReq(user.userData.weaponList);
            let talentReq = GeneralCtrl.getAllTalentReq(user.userData.charList);
            let allReq = addObjects(charReq, weaponReq, talentReq);

            
            for (let key in allReq) {
                if (key === "weaponExp" || key === "charExp") {
                    for (let i=0; i<allReq[key].mat.length; i++) {
                        let userMat = GeneralCtrl.searchArray(allReq[key].mat[i].name, user.userData.materials[key]);
                        if (userMat === null) {
                            allReq[key].mat[i]["imgPath"] = GeneralCtrl.searchArray(allReq[key].mat[i].name, GeneralCtrl.generalData.img).imgPath;
                            continue;
                        }
                        if (allReq[key].mat[i].reqNum < userMat.number) {
                            allReq[key].mat[i].reqNum = 0;
                        } else {
                            allReq[key].mat[i].reqNum -= userMat.number;
                        }
                        allReq[key].mat[i]["imgPath"] = userMat.imgPath;
                    }
                } else {
                    for (let i=0; i<allReq[key].length; i++) {
                        let userMat = GeneralCtrl.searchArray(allReq[key][i].name, user.userData.materials[key]);
                        if ("matList" in allReq[key][i]) {
                            for (let j=0; j<allReq[key][i].matList.length; j++) {
                                let userInnerMat = GeneralCtrl.searchArray(allReq[key][i].matList[j].name, userMat.matList);
                                if (userInnerMat === null) {
                                    allReq[key][i].matList[j]["imgPath"] = GeneralCtrl.searchArray(allReq[key][i].matList[j].name, GeneralCtrl.generalData.img).imgPath;
                                    continue;
                                };
                                if (allReq[key][i].matList[j].reqNum < userInnerMat.number) {
                                    allReq[key][i].matList[j].reqNum = 0;
                                } else {
                                    allReq[key][i].matList[j].reqNum -= userInnerMat.number;
                                }
                                allReq[key][i].matList[j]["imgPath"] = userInnerMat.imgPath;
                            }
                        } else {
                            if (userMat === null) {
                                allReq[key][i]["imgPath"] = GeneralCtrl.searchArray(allReq[key][i].name, GeneralCtrl.generalData.img).imgPath;
                                continue;
                            }
                            if (allReq[key][i].reqNum < userMat.number) {
                                allReq[key][i].reqNum = 0;
                            } else {
                                allReq[key][i].reqNum -= userMat.number;
                            }
                            allReq[key][i]["imgPath"] = userMat.imgPath;
                        }
                    }
                }
            }

            return res.json(allReq);
        }).catch(err => console.log(err));
    });
}

// Gets all requirements for all characters and talents
getCalcAllCharReq = (req, res) => {
    if (req.token === "Unauthorized") {
        return res.status(401).json({ error: "Unauthorized"});
    }

    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Could not connect" });
        }

        User.findOne({ email: data.email }).then(user => {
            let allCharReq = GeneralCtrl.getAllCharReq(user.userData.charList);
            Object.defineProperty(allCharReq, "charExp", Object.getOwnPropertyDescriptor(allCharReq, "exp"));
            delete allCharReq["exp"];

            let talentReq = GeneralCtrl.getAllTalentReq(user.userData.charList);
            allCharReq.mora += talentReq.mora;

            for (let key in talentReq) {
                if (key === "comMat") {
                    for (let i=0; i<talentReq[key].length; i++) {
                        for (let j=0; j<talentReq[key][i]["matList"].length; j++) {
                            allCharReq[key][i]["matList"][j].reqNum += talentReq[key][i]["matList"][j].reqNum;
                        }
                    }
                } else if (key !== "mora") {
                    allCharReq[key] = talentReq[key];
                }
            }
            allCharReq["misc"] = [
                {
                    name: "Mora",
                    type: "None",
                    reqNum: allCharReq.mora,
                },
                {
                    name: "Crown of Insight",
                    type: "gold",
                    reqNum: allCharReq.crownNum,
                }
            ];

            delete allCharReq["mora"];
            delete allCharReq["crownNum"];

            for (let key in allCharReq) {
                if (key === "charExp") {
                    for (let i=0; i<allCharReq[key].mat.length; i++) {
                        let userMat = GeneralCtrl.searchArray(allCharReq[key].mat[i].name, user.userData.materials[key]);
                        if (userMat === null) {
                            allCharReq[key].mat[i]["imgPath"] = GeneralCtrl.searchArray(allCharReq[key].mat[i].name, GeneralCtrl.generalData.img).imgPath;
                            continue;
                        }
                        if (allCharReq[key].mat[i].reqNum < userMat.number) {
                            allCharReq[key].mat[i].reqNum = 0;
                        } else {
                            allCharReq[key].mat[i].reqNum -= userMat.number;
                        }
                        allCharReq[key].mat[i]["imgPath"] = userMat.imgPath;
                    }
                } else {
                    for (let i=0; i<allCharReq[key].length; i++) {
                        let userMat = GeneralCtrl.searchArray(allCharReq[key][i].name, user.userData.materials[key]);
                        if ("matList" in allCharReq[key][i]) {
                            for (let j=0; j<allCharReq[key][i].matList.length; j++) {
                                let userInnerMat = GeneralCtrl.searchArray(allCharReq[key][i].matList[j].name, userMat.matList);
                                if (userInnerMat === null) {
                                    allCharReq[key][i].matList[j]["imgPath"] = GeneralCtrl.searchArray(allCharReq[key][i].matList[j].name, GeneralCtrl.generalData.img).imgPath;
                                    continue;
                                };
                                if (allCharReq[key][i].matList[j].reqNum < userInnerMat.number) {
                                    allCharReq[key][i].matList[j].reqNum = 0;
                                } else {
                                    allCharReq[key][i].matList[j].reqNum -= userInnerMat.number;
                                }
                                allCharReq[key][i].matList[j]["imgPath"] = userInnerMat.imgPath;
                            }
                        } else {
                            if (userMat === null) {
                                allCharReq[key][i]["imgPath"] = GeneralCtrl.searchArray(allCharReq[key][i].name, GeneralCtrl.generalData.img).imgPath;
                                continue;
                            }
                            if (allCharReq[key][i].reqNum < userMat.number) {
                                allCharReq[key][i].reqNum = 0;
                            } else {
                                allCharReq[key][i].reqNum -= userMat.number;
                            }
                            allCharReq[key][i]["imgPath"] = userMat.imgPath;
                        }
                    }
                }
            }

            return res.json(allCharReq);
        }).catch(err => console.log(err));
    });
}

// Gets all requirements for single character and all character's talents
getCalcCharReq = (req, res) => {
    if (req.token === "Unauthorized") {
        let charReq = GeneralCtrl.getCharReq(convertToName(req.params.name), 1, 90);
        Object.defineProperty(charReq, "charExp", Object.getOwnPropertyDescriptor(charReq, "exp"));
        delete charReq["exp"];

        charReq["misc"] = [
            {
                name: "Mora",
                type: "None",
                reqNum: charReq.mora,
            },
        ];

        delete charReq["mora"];

        return res.json(charReq);
    }

    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Could not connect" });
        }

        User.findOne({ email: data.email }).then(user => {
            let character = GeneralCtrl.searchArray(convertToName(req.params.name), GeneralCtrl.generalData.charList);
            let lvlReq = GeneralCtrl.searchArray(character.name, user.userData.charList);
            let charReq = GeneralCtrl.getCharReq(character.name, lvlReq.curLvl, lvlReq.reqLvl);

            let talentReq = GeneralCtrl.getAllTalentReq([lvlReq]);

            if (character.isTraveler) {
                let talentMatReq = [];
                for (let i=0; i<talentReq.talentMat.length; i++) {
                    for (let j=0; j<talentReq.talentMat[i].matList.length; j++) {
                        if (talentReq.talentMat[i].matList[j].number > 0) {
                            if (talentReq.talentMat[i].matList[j].number < user.userData.materials.talentMat[i].matList[j].number) {
                                talentReq.talentMat[i].matList[j].number = 0;
                            } else {
                                talentReq.talentMat[i].matList[j].number -= user.userData.materials.talentMat[i].matList[j].number;
                            }
                            talentReq.talentMat[i].matList[j]["imgPath"] = user.userData.materials.talentMat[i].matList[j].imgPath;
                            talentMatReq.push(talentReq.talentMat[i].matList[j]);
                        }
                    }
                }
                charReq["talentMat"] = talentMatReq;

                let comMatReq = [];
                for (let i=0; i<talentReq.comMat.length; i++) {
                    for (let j=0; j<talentReq.comMat[i].matList.length; j++) {
                        if (talentReq.comMat[i].matList[j].number > 0) {
                            if (talentReq.comMat[i].matList[j].number < user.userData.materials.comMat[i].matList[j].number) {
                                talentReq.comMat[i].matList[j].number = 0;
                            } else {
                                talentReq.comMat[i].matList[j].number -= user.userData.materials.comMat[i].matList[j].number;
                            }
                            talentReq.comMat[i].matList[j]["imgPath"] = user.userData.materials.comMat[i].matList[j].imgPath;
                            comMatReq.push(talentReq.comMat[i].matList[j]);
                        }
                    }
                }
                charReq["comMat"] = comMatReq;

                let bossMatReq = [];
                for (let i=0; i<talentReq.bossMat.length; i++) {
                    if (talentReq.bossMat[i].number > 0) {
                        if (talentReq.bossMat[i].number < user.userData.materials.bossMat[i].number) {
                            talentReq.bossMat[i].number = 0;
                        } else {
                            talentReq.bossMat[i].number -= user.userData.materials.bossMat[i].number;
                        }
                        talentReq.bossMat[i]["imgPath"] = user.userData.materials.bossMat[i].imgPath;
                        bossMatReq.push(talentReq.bossMat[i]);
                    }
                }
                charReq["bossMat"] = bossMatReq;

            } else {
                let talentMatReq = GeneralCtrl.searchArray(character.talentMat, talentReq.talentMat).matList;
                let talentMat = GeneralCtrl.searchArray(character.talentMat, user.userData.materials.talentMat).matList;
                for (let i=0; i<talentMatReq.length; i++) {
                    talentMatReq[i]["imgPath"] = talentMat[i].imgPath;
                    if (talentMatReq[i].reqNum < talentMat[i].number) {
                        talentMatReq[i].reqNum = 0;
                    } else {
                        talentMatReq[i].reqNum -= talentMat[i].number;
                    }
                    Object.defineProperty(talentMatReq[i], "number", Object.getOwnPropertyDescriptor(talentMatReq[i], "reqNum"));
                    delete talentMatReq[i]["reqNum"];
                }
                charReq["talentMat"] = talentMatReq;

                let talentComMat = GeneralCtrl.searchArray(character.comMat, talentReq.comMat).matList;
                let comMat = GeneralCtrl.searchArray(character.comMat, user.userData.materials.comMat).matList;
                for (let i=0; i<comMat.length; i++) {
                    charReq.comMat[i].reqNum += talentComMat[i].reqNum;
                    charReq.comMat[i]["imgPath"] = comMat[i].imgPath;
                    if (charReq.comMat[i].reqNum < comMat[i].number) {
                        charReq.comMat[i].reqNum = 0;
                    } else {
                        charReq.comMat[i].reqNum -= comMat[i].number;
                    }
                    Object.defineProperty(charReq.comMat[i], "number", Object.getOwnPropertyDescriptor(charReq.comMat[i], "reqNum"));
                    delete charReq.comMat[i]["reqNum"];
                }

                let bossMat = GeneralCtrl.searchArray(character.bossMat, user.userData.materials.bossMat);
                let bossMatReq = GeneralCtrl.searchArray(character.bossMat, talentReq.bossMat);
                charReq["bossMat"] = [{
                    name: bossMat.name,
                    number: bossMatReq.reqNum < bossMat.number ? 0 : bossMatReq.reqNum - bossMat.number,
                    imgPath: bossMat.imgPath,
                }];
            }

            console.log(character)
            let eleCrys = GeneralCtrl.searchArray(character.eleCrys, user.userData.materials.eleCrys).matList;
            for (let i=0; i<eleCrys.length; i++) {
                charReq.eleCrys[i]["imgPath"] = eleCrys[i].imgPath;
                if (charReq.eleCrys[i].reqNum < eleCrys[i].number) {
                    charReq.eleCrys[i].reqNum = 0;
                } else {
                    charReq.eleCrys[i].reqNum -= eleCrys[i].number;
                }
                Object.defineProperty(charReq.eleCrys[i], "number", Object.getOwnPropertyDescriptor(charReq.eleCrys[i], "reqNum"));
                delete charReq.eleCrys[i]["reqNum"];
            }

            let eleMat = GeneralCtrl.searchArray(charReq.eleMat, user.userData.materials.eleMat);
            charReq["eleMatImgPath"] = eleMat.imgPath;
            if (charReq.eleMatNum < eleMat.number) {
                charReq.eleMatNum = 0;
            } else {
                charReq.eleMatNum -= eleMat.number;
            }

            let locSpec = GeneralCtrl.searchArray(charReq.locSpec, user.userData.materials.locSpec);
            charReq["locSpecImgPath"] = locSpec.imgPath;
            if (charReq.locSpecNum < locSpec.number) {
                charReq.locSpecNum = 0;
            } else {
                charReq.locSpecNum -= locSpec.number;
            }

            let expMat = user.userData.materials.charExp.mat;
            for (let i=0; i<expMat.length; i++) {
                charReq.exp.mat[i]["imgPath"] = expMat[i].imgPath;
                if (charReq.exp.mat[i].reqNum < expMat[i].number) {
                    charReq.exp.mat[i].reqNum = 0;
                } else {
                    charReq.exp.mat[i].reqNum -= expMat[i].number;
                }
                Object.defineProperty(charReq.exp.mat[i], "number", Object.getOwnPropertyDescriptor(charReq.exp.mat[i], "reqNum"));
                delete charReq.exp.mat[i]["reqNum"];
            }

            charReq.mora += talentReq.mora;
            if (charReq.mora < user.userData.materials.mora) {
                charReq.mora = 0;
            } else {
                charReq.mora -= user.userData.materials.mora;
            }

            charReq["crownNum"] = talentReq.crownNum;
            if (charReq.crownNum < user.userData.materials.crownNum) {
                charReq.crownNum = 0;
            } else {
                charReq.crownNum -= user.userData.materials.crownNum;
            }

            return res.json(charReq);
        });
    });
}

// Gets all requirements for each of a character's single talent
getCalcTalentReq = (req, res) => {
    if (req.token === "Unauthorized") {
        return res.status(401).json({ error: "Unauthorized"});
    }

    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Could not connect" });
        }

        User.findOne({ email: data.email }).then(user => {
            let lvlReq = GeneralCtrl.searchArray(convertToName(req.params.name), user.userData.charList);
            let talentReq = {
                autoAttack: null,
                eleSkill: null,
                eleBurst: null,
            }
            let character = GeneralCtrl.searchArray(lvlReq.name, GeneralCtrl.generalData.charList);

            for (let talent in talentReq) {
                let curReq = GeneralCtrl.getTalentReq(lvlReq.name, lvlReq[talent].curLvl, lvlReq[talent].reqLvl, talent);

                if (character.isTraveler) {
                    for (let i=0; i<curReq.talentMat.length; i++) {
                        let curName = curReq.talentMat[i].name;
                        for (k=0; k<user.userData.materials.talentMat.length; k++) {
                            for (l=0; l<user.userData.materials.talentMat[k].matList.length; l++) {
                                if (curName === user.userData.materials.talentMat[k].matList[l].name) {
                                    curReq.talentMat[i]["imgPath"] = user.userData.materials.talentMat[k].matList[l].imgPath;
                                    if (curReq.talentMat[i].reqNum < user.userData.materials.talentMat[k].matList[l].number) {
                                        curReq.talentMat[i].reqNum = 0;
                                    } else {
                                        curReq.talentMat[i].reqNum -= user.userData.materials.talentMat[k].matList[l].number;
                                    }
                                    Object.defineProperty(curReq.talentMat[i], "number", Object.getOwnPropertyDescriptor(curReq.talentMat[i], "reqNum"));
                                    delete curReq.talentMat[i]["reqNum"];
                                }
                            }
                        }
                    }
                } else {
                    let talentMat = GeneralCtrl.searchArray(character.talentMat, user.userData.materials.talentMat).matList;
                    for (let i=0; i<curReq.talentMat.length; i++) {
                        curReq.talentMat[i]["imgPath"] = talentMat[i].imgPath;
                        if (curReq.talentMat[i].reqNum < talentMat[i].number) {
                            curReq.talentMat[i].reqNum = 0;
                        } else {
                            curReq.talentMat[i].reqNum -= talentMat[i].number;
                        }
                        Object.defineProperty(curReq.talentMat[i], "number", Object.getOwnPropertyDescriptor(curReq.talentMat[i], "reqNum"));
                        delete curReq.talentMat[i]["reqNum"];
                    }
                }

                let ele;
                if (character.isTraveler) {
                    ele = character.name.split(' ')[1].toLowerCase();
                }

                let comName = !character.isTraveler ? character.comMat : GeneralCtrl.generalData.miscData.traveler[ele][talent].comMat;
                let comMat = GeneralCtrl.searchArray(comName, user.userData.materials.comMat).matList;

                for (let i=0; i<curReq.comMat.length; i++) {
                    curReq.comMat[i]["imgPath"] = comMat[i].imgPath;
                    if (curReq.comMat[i].reqNum < comMat[i].number) {
                        curReq.comMat[i].reqNum = 0;
                    } else {
                        curReq.comMat[i].reqNum -= comMat[i].number;
                    }
                    Object.defineProperty(curReq.comMat[i], "number", Object.getOwnPropertyDescriptor(curReq.comMat[i], "reqNum"));
                    delete curReq.comMat[i]["reqNum"];
                }

                let bossName = character.bossMat ? character.bossMat : GeneralCtrl.generalData.miscData.traveler[ele][talent].bossMat;
                let bossMat = GeneralCtrl.searchArray(bossName, user.userData.materials.bossMat);
                if (curReq.bossMatNum < bossMat.number) {
                    curReq.bossMatNum= 0;
                } else {
                    curReq.bossMatNum -= bossMat.number;
                }
                curReq["bossMatImgPath"] = bossMat.imgPath;

                if (curReq.mora < user.userData.materials.mora) {
                    charReq.mora = 0;
                } else {
                    curReq.mora -= user.userData.materials.mora;
                }

                curReq.crownNum = user.userData.materials.crownNum;
                if (curReq.crownNum < user.userData.materials.crownNum) {
                    curReq.crownNum = 0;
                } else {
                    curReq.crownNum -= user.userData.materials.crownNum;
                }

                curReq["imgPath"] = GeneralCtrl.searchArray(character[talent], GeneralCtrl.generalData.img).imgPath;

                talentReq[talent] = curReq;
            }

            return res.json(talentReq);
        });
    });
}

// Gets all requirements for all weapons
getCalcAllWeaponReq = (req, res) => {
    if (req.token === "Unauthorized") {
        return res.status(401).json({ error: "Unauthorized"});
    }

    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Could not connect" });
        }

        User.findOne({ email: data.email }).then(user => {
            let weaponReq = GeneralCtrl.getAllWeaponReq(user.userData.weaponList);

            for (let key in weaponReq) {
                if (key !== "exp" && key !== "mora") {
                    for (let i=0; i<weaponReq[key].length; i++) {
                        if ("matList" in weaponReq[key][i]) {
                            for (let j=0; j<weaponReq[key][i]["matList"].length; j++) {
                                if (weaponReq[key][i]["matList"][j].reqNum < user.userData.materials[key][i]["matList"][j].number) {
                                    weaponReq[key][i]["matList"][j].reqNum = 0;
                                } else {
                                    weaponReq[key][i]["matList"][j].reqNum -= user.userData.materials[key][i]["matList"][j].number;
                                }
                                weaponReq[key][i]["matList"][j]["imgPath"] = user.userData.materials[key][i]["matList"][j].imgPath;
                                Object.defineProperty(weaponReq[key][i]["matList"][j], "number", Object.getOwnPropertyDescriptor(weaponReq[key][i]["matList"][j], "reqNum"));
                                delete weaponReq[key][i]["matList"][j]["reqNum"];
                            }
                        } else {
                            if (weaponReq[key][i].reqNum < user.userData.materials[key][i].number) {
                                weaponReq[key][i].reqNum = 0;
                            } else {
                                weaponReq[key][i].reqNum -= user.userData.materials[key][i].number;
                            }
                            weaponReq[key][i]["imgPath"] < user.userData.materials[key][i].imgPath;
                            Object.defineProperty(weaponReq[key][i], "number", Object.getOwnPropertyDescriptor(weaponReq[key][i], "reqNum"));
                            delete weaponReq[key][i]["reqNum"];
                        }
                    }
                } else if (key === "exp") {
                    for (let i=0; i<weaponReq[key].mat.length; i++) {
                        if (weaponReq.exp.mat[i].reqNum < user.userData.materials.weaponExp.mat[i].number) {
                            weaponReq.exp.mat[i].reqNum = 0;
                        } else {
                            weaponReq.exp.mat[i].reqNum -= user.userData.materials.weaponExp.mat[i].number;
                        }
                        weaponReq.exp.mat[i]["imgPath"] = user.userData.materials.weaponExp.mat[i].imgPath;
                        Object.defineProperty(weaponReq.exp.mat[i], "number", Object.getOwnPropertyDescriptor(weaponReq.exp.mat[i], "reqNum"));
                        delete weaponReq.exp.mat[i]["reqNum"];
                    }   
                }
            }

            if (weaponReq.mora < user.userData.materials.mora) {
                weaponReq.mora = 0;
            } else {
                weaponReq.mora -= user.userData.materials.mora;
            }

            return res.json(weaponReq);
        });
    });
}

// Gets all requirements for single weapon
getCalcWeaponReq = (req, res) => {
    if (req.token === "Unauthorized") {
        let weapon = GeneralCtrl.searchArray(convertToName(req.params.name), GeneralCtrl.generalData.weaponList);
        let level = GeneralCtrl.searchArray(weapon.stars, GeneralCtrl.generalData.weaponLevel).weaponStarLevel;
        let lastLevel = level[level.length-1];
        let weaponReq = GeneralCtrl.getWeaponReq(weapon.name, 1, lastLevel.level);

        for (let key in weaponReq) {
            if (key === "weaponMat" || key === "eliteMat" || key === "comMat") {
                for (let i=0; i<weaponReq[key].length; i++) {
                    weaponReq[key][i]["imgPath"] = GeneralCtrl.searchArray(weaponReq[key][i].name, GeneralCtrl.generalData.img).imgPath;
                    Object.defineProperty(weaponReq[key][i], "number", Object.getOwnPropertyDescriptor(weaponReq[key][i], "reqNum"));
                    delete weaponReq[key][i]["reqNum"];
                }
            } else if (key === "exp") {
                for (let i=0; i<weaponReq[key].mat.length; i++) {
                    weaponReq.exp.mat[i]["imgPath"] = GeneralCtrl.searchArray(weaponReq.exp.mat[i].name, GeneralCtrl.generalData.img).imgPath;
                    Object.defineProperty(weaponReq.exp.mat[i], "number", Object.getOwnPropertyDescriptor(weaponReq.exp.mat[i], "reqNum"));
                    delete weaponReq.exp.mat[i]["reqNum"];
                }
            }
        }
        return res.json(weaponReq);
    }

    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Could not connect" });
        }

        User.findOne({ email: data.email }).then(user => {
            let weapon = GeneralCtrl.searchArray(convertToName(req.params.name), GeneralCtrl.generalData.weaponList);
            let lvlReq = GeneralCtrl.searchArray(weapon.name, user.userData.weaponList);
            let weaponReq = GeneralCtrl.getWeaponReq(weapon.name,lvlReq.curLvl, lvlReq.reqLvl, weapon.number);
            for (let key in weaponReq) {
                if (key === "weaponMat" || key === "eliteMat" || key === "comMat") {
                    for (let i=0; i<weaponReq[key].length; i++) {
                        let userMat = GeneralCtrl.searchArray(weapon[key], user.userData.materials[key]).matList;
                        if (weaponReq[key][i].reqNum < userMat[i].number) {
                            weaponReq[key][i].reqNum = 0;
                        } else {
                            weaponReq[key][i].reqNum -= userMat[i].number;
                        }
                        weaponReq[key][i]["imgPath"] = userMat[i].imgPath;
                        Object.defineProperty(weaponReq[key][i], "number", Object.getOwnPropertyDescriptor(weaponReq[key][i], "reqNum"));
                        delete weaponReq[key][i]["reqNum"];
                    }
                } else if (key === "exp") {
                    for (let i=0; i<weaponReq[key].mat.length; i++) {
                        if (weaponReq.exp.mat[i].reqNum < user.userData.materials.weaponExp.mat[i].number) {
                            weaponReq.exp.mat[i].reqNum = 0;
                        } else {
                            weaponReq.exp.mat[i].reqNum -= user.userData.materials.weaponExp.mat[i].number;
                        }
                        weaponReq.exp.mat[i]["imgPath"] = user.userData.materials.weaponExp.mat[i].imgPath;
                        Object.defineProperty(weaponReq.exp.mat[i], "number", Object.getOwnPropertyDescriptor(weaponReq.exp.mat[i], "reqNum"));
                        delete weaponReq.exp.mat[i]["reqNum"];
                    }   
                }
            }

            if (weaponReq.mora < user.userData.materials.mora) {
                weaponReq.mora = 0;
            } else {
                weaponReq.mora -= user.userData.materials.mora;
            }

            return res.json(weaponReq);
        });
    });
}

getImgPath = (req, res) => {
    return res.json(GeneralCtrl.searchArray(req.body.name, GeneralCtrl.generalData.img));
}

module.exports = {
    createUser,
    loginUser,
    checkToken,
    updateUserData,
    getUserData,
    getGeneralData,
    getAllReq,
    getCalcAllCharReq,
    getCalcCharReq,
    getCalcTalentReq,
    getCalcAllWeaponReq,
    getCalcWeaponReq,
    getImgPath,
};