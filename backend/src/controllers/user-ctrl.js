const User = require("../db/models/user-model");
const GeneralCtrl = require("./general-ctrl");
const Validator = require("validator");
const isEmpty = require("is-empty");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secretOrKey } = require("../config/config");
const { init } = require("../db/models/user-model");

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

function initializeData() {
    let data = {
        charList: [],
        weaponList: [],
        materials: {
            eleCrys: [],
            eleMat: [],
            locSpec: [],
            comMat: [],
            eliteMat: [],
            bossMat: [],
            talentMat: [],
            weaponMat: [],
            weaponExp: {
                mat: [],
                wastedExp: 0,
            },
            charExp: {
                mat: [],
                wastedExp: 0,
            },
            crownNum: 0,
            mora: 0,
        },
    };
    let miscData = GeneralCtrl.generalData.miscData;
    let multiMat = miscData.matType.multiType;
    let singleMat = miscData.matType.singleType;
    let rarTypes = miscData.rarType;

    for (let i=0; i<multiMat.length; i++) {
        let shortNames = miscData.shortNames[multiMat[i]];
        for (let j=0; j<shortNames.length; j++) {
            let matCat = {
                name: shortNames[j],
                matList: [],
            }
            for (let k=0; k<rarTypes.length; k++) {
                let mat = GeneralCtrl.getMatNameType(shortNames[j], multiMat[i], rarTypes[k]);
                if (mat !== null) {
                    console.log(mat.name);
                    let imgPath = GeneralCtrl.searchArray(mat.name, GeneralCtrl.generalData.img).imgPath;
                    let insertMat = {
                        name: mat.name,
                        type: mat.type,
                        number: 0,
                        imgPath: imgPath,
                    };
                    matCat.matList.push(insertMat);
                }
            }
            data.materials[multiMat[i]].push(matCat);
        }
    }

    for (let i=0; i<singleMat.length; i++) {
        let names = GeneralCtrl.generalData.materials[singleMat[i]];
        if (singleMat[i] in data.materials){
            for (let j=0; j<names.length; j++) {
                let imgPath = GeneralCtrl.searchArray(names[j].name, GeneralCtrl.generalData.img).imgPath;
                let mat = {
                    name: names[j].name,
                    type: names[j].type,
                    number: 0,
                    imgPath: imgPath,
                };
                data.materials[singleMat[i]].push(mat);
            }
        }
    }

    let charExp = GeneralCtrl.generalData.materials.charExp;
    let weaponExp = GeneralCtrl.generalData.materials.weaponExp;

    for (let i=0; i<charExp.length; i++) {
        let imgPath = GeneralCtrl.searchArray(charExp[i].name, GeneralCtrl.generalData.img).imgPath;
        let mat = {
            name: charExp[i].name,
            type: charExp[i].type,
            number: 0,
            exp: charExp[i].exp,
            imgPath: imgPath,
        };
        data.materials.charExp.mat.push(mat);
    }

    for (let i=0; i<weaponExp.length; i++) {
        let imgPath = GeneralCtrl.searchArray(weaponExp[i].name, GeneralCtrl.generalData.img).imgPath;
        let mat = {
            name: weaponExp[i].name,
            type: weaponExp[i].type,
            number: 0,
            exp: weaponExp[i].exp,
            imgPath: imgPath,
        }

        data.materials.weaponExp.mat.push(mat);
    }

    return data;
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
        
        let data = initializeData();

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
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
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
        });
    });
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
        User.updateOne(
            { email: data.email },
            { $set: { userData: req.body.userData } }
        )
            .then(() => res.json({ success: true }))
            .catch(err => res.json({ error: "Could not update user data" }));
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
            let data = initializeData().materials;
            let charReq = GeneralCtrl.getAllCharReq(user.userData.charList);
            data.mora += charReq.mora;
            data.charExp.wastedExp += charReq.exp.wastedExp;

            for (let key in charReq) {
                if (key !== "exp" && key !== "mora") {
                    for (let i=0; i<charReq[key].length; i++) {
                        if ("matList" in charReq[key][i]) {
                            for (let j=0; j<charReq[key][i].matList.length; j++) {
                                data[key][i]["matList"][j].number += charReq[key][i]["matList"][j].reqNum;
                            }
                        } else {
                            data[key][i].number += charReq[key][i].reqNum;
                        }
                    }
                } else if (key === "exp") {
                    for (let i=0; i<charReq[key].mat.length; i++) {
                        data.charExp.mat[i].number += charReq.exp.mat[i].reqNum;
                    }

                }
            }

            let weaponReq = GeneralCtrl.getAllWeaponReq(user.userData.weaponList);
            data.mora += weaponReq.mora;
            data.weaponExp.wastedExp += weaponReq.exp.wastedExp;

            for (let key in weaponReq) {
                if (key !== "exp" && key !== "mora") {
                    for (let i=0; i<weaponReq[key].length; i++) {
                        if ("matList" in weaponReq[key][i]) {
                            for (let j=0; j<weaponReq[key][i]["matList"].length; j++) {
                                data[key][i]["matList"][j].number += weaponReq[key][i]["matList"][j].reqNum;
                            }
                        } else {
                            data[key][i].number += weaponReq[key][i].reqNum;
                        }
                    }
                } else if (key === "exp") {
                    for (let i=0; i<weaponReq[key].mat.length; i++) {
                        data.weaponExp.mat[i].number += weaponReq.exp.mat[i].reqNum;
                    }   
                }
            }

            let talentReq = GeneralCtrl.getAllTalentReq(user.userData.charList);
            data.mora += talentReq.mora;
            data.mora += talentReq.crownNum;

            for (let key in talentReq) {
                if (key !== "crownNum" && key !== "mora") {
                    for (let i=0; i<talentReq[key].length; i++) {
                        if ("matList" in talentReq[key][i]) {
                            for (let j=0; j<talentReq[key][i]["matList"].length; j++) {
                                data[key][i]["matList"][j].number += talentReq[key][i]["matList"][j].reqNum;
                            }
                        } else {
                            data[key][i].number += talentReq[key][i].reqNum;
                        }
                    }
                }
            }

            for (let key in data) {
                if (key !== "crownNum" && key !== "mora") {
                    for (let i=0; i<data[key].length; i++) {
                        if ("matList" in data[key][i]) {
                            for (let j=0; j<data[key][i].matList.length; j++) {
                                if (data[key][i]["matList"][j].number < user.userData.materials[key][i]["matList"][j].number) {
                                    data[key][i]["matList"][j].number = 0;
                                } else {
                                    data[key][i]["matList"][j].number -= user.userData.materials[key][i]["matList"][j].number;
                                }
                            }
                        } else {
                            if (data[key][i].number < user.userData.materials[key][i].number) {
                                data[key][i].number = 0;
                            } else {
                                data[key][i].number -= user.userData.materials[key][i].number;
                            }
                        }
                    }
                } else if (key === "charExp" || key === "weaponExp") {
                    for (let i=0; i<data[key].mat.length; i++) {
                        if (data[key].mat[i].number < user.userData.materials[key][i].number) {
                            data[key].mat[i].number = 0;
                        } else {
                            data[key].mat[i].number -= user.userData.materials[key][i].number;
                        }
                    }
                } else if (key === "mora") {
                    if (data.mora < user.userData.materials.mora) {
                        data.mora = 0;
                    } else {
                        data.mora -= user.userData.materials.mora;
                    }
                }
            }

            return res.json(data);
        });
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
            let data = initializeData().materials;
            let charReq = GeneralCtrl.getAllCharReq(user.userData.charList);

            for (let key in charReq) {
                if (key !== "exp" && key !== "mora") {
                    for (let i=0; i<charReq[key].length; i++) {
                        if ("matList" in charReq[key][i]) {
                            for (let j=0; j<charReq[key][i].matList.length; j++) {
                                data[key][i]["matList"][j].number += charReq[key][i]["matList"][j].reqNum;
                            }
                        } else {
                            data[key][i].number += charReq[key][i].reqNum;
                        }
                    }
                } else if (key === "exp") {
                    for (let i=0; i<charReq[key].mat.length; i++) {
                        data.charExp.mat[i].number += charReq.exp.mat[i].reqNum;
                    }
                    data.charExp.wastedExp += charReq.exp.wastedExp;
                } else if (key === "mora") {
                    data.mora += charReq.mora;
                }
            }

            let talentReq = GeneralCtrl.getAllTalentReq(user.userData.charList);

            for (let key in talentReq) {
                if (key !== "exp" && key !== "mora") {
                    for (let i=0; i<talentReq[key].length; i++) {
                        if ("matList" in talentReq[key][i]) {
                            for (let j=0; j<talentReq[key][i]["matList"].length; j++) {
                                data[key][i]["matList"][j].number += talentReq[key][i]["matList"][j].reqNum;
                            }
                        } else {
                            data[key][i].number += talentReq[key][i].reqNum;
                        }
                    }
                } else if (key === "mora") {
                    data.mora += talentReq.mora;
                }
            }

            for (let key in data) {
                if (key !== "crownNum" && key !== "mora") {
                    for (let i=0; i<data[key].length; i++) {
                        if ("matList" in data[key][i]) {
                            for (let j=0; j<data[key][i].matList.length; j++) {
                                if (data[key][i]["matList"][j].number < user.userData.materials[key][i]["matList"][j].number) {
                                    data[key][i]["matList"][j].number = 0;
                                } else {
                                    data[key][i]["matList"][j].number -= user.userData.materials[key][i]["matList"][j].number;
                                }
                            }
                        } else {
                            if (data[key][i].number < user.userData.materials[key][i].number) {
                                data[key][i].number = 0;
                            } else {
                                data[key][i].number -= user.userData.materials[key][i].number;
                            }
                        }
                    }
                } else if (key === "charExp" || key === "weaponExp") {
                    for (let i=0; i<data[key].mat.length; i++) {
                        if (data[key].mat[i].number < user.userData.materials[key][i].number) {
                            data[key].mat[i].number = 0;
                        } else {
                            data[key].mat[i].number -= user.userData.materials[key][i].number;
                        }
                    }
                } else if (key === "mora") {
                    if (data.mora < user.userData.materials.mora) {
                        data.mora = 0;
                    } else {
                        data.mora -= user.userData.materials.mora;
                    }
                }
            }

            delete data["eliteMat"];
            delete data["weaponMat"];
            delete data["weaponExp"];
            Object.defineProperty(data, "exp", Object.getOwnPropertyDescriptor(data, "charExp"));
            delete data["charExp"];


            return res.json(data);
        });
    });
}

// Gets all requirements for single character and all character's talents
getCalcCharReq = (req, res) => {
    if (req.token === "Unauthorized") {
        let charReq = GeneralCtrl.getCharReq(req.params.name, 1, 90);
        for (let key in charReq) {
            if (key !== "exp" && key !== "mora") {
                for (let i=0; i<charReq[key].length; i++) {
                    if ("matList" in charReq[key][i]) {
                        for (let j=0; j<charReq[key][i].matList.length; j++) {
                            charReq[key][i]["matList"][j]["imgPath"] = GeneralCtrl.searchArray(charReq[key][i]["matList"][j].name, GeneralCtrl.generalData.img).imgPath;
                        }
                    } else {
                        charReq[key][i]["imgPath"] = GeneralCtrl.searchArray(charReq[key][i].name, GeneralCtrl.generalData.img).imgPath;
                    }
                }
            } else if (key === "exp") {
                for (let i=0; i<charReq[key].mat.length; i++) {
                    charReq.exp.mat[i]["imgPath"] = GeneralCtrl.searchArray(charReq.exp.mat[i].name, GeneralCtrl.generalData.img).imgPath;;
                }
            }
        }
        return res.json(charReq);
    }

    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Could not connect" });
        }

        User.findOne({ email: data.email }).then(user => {
            let character = GeneralCtrl.searchArray(req.params.name, GeneralCtrl.generalData.charList);
            let lvlReq = GeneralCtrl.searchArray(req.params.name, user.userData.charList);
            let charReq = GeneralCtrl.getCharReq(req.params.name, lvlReq.curLvl, lvlReq.reqLvl);

            let talentReq = GeneralCtrl.getAllTalentReq([lvlReq]);

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
            charReq["bossMat"] = bossMat.name;
            charReq["bossMatType"] = bossMat.type;
            charReq["bossMatNum"] = bossMatReq.reqNum < bossMat.number ? 0 : bossMatReq.reqNum - bossMat.number;
            charReq["bossMatImgPath"] = bossMat.imgPath;


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
            let lvlReq = GeneralCtrl.searchArray(req.params.name, user.userData.charList);
            let talentReq = {
                auttoAttack: null,
                eleSkill: null,
                eleBurst: null,
            }
            let character = GeneralCtrl.searchArray(req.params.name, GeneralCtrl.generalData.charList);

            for (let talent in talentReq) {
                let curReq = GeneralCtrl.getTalentReq(req.params.name, lvlReq[talent].curLvl, lvlReq[talent].reqLvl);
                let talentMat = GeneralCtrl.searchArray(character.talentMat, user.userData.materials.talentMat).matList;
                for (let i=0; i<curReq.talentMat; i++) {
                    talentMatReq[i]["imgPath"] = talentMat[i].imgPath;
                    if (curReq.talentMat[i].reqNum < talentMat[i].number) {
                        curReq.talentMat[i].reqNum = 0;
                    } else {
                        curReq.talentMat[i].reqNum -= talentMat[i].number;
                    }
                    Object.defineProperty(curReq.talentMat[i], "number", Object.getOwnPropertyDescriptor(curReq.talentMat[i], "reqNum"));
                    delete curReq.talentMat[i]["reqNum"];
                }

                let comMat = GeneralCtrl.searchArray(character.comMat, user.userData.materials.comMat).matList;
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

                let bossMat = GeneralCtrl.searchArray(character.bossMat, user.userData.materials.bossMat);
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

function convertToName(name) {
    conName = name.replace("%27", "'");
    conName = conName.replace("_", " ");
    return conName;
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
        console.log(weaponReq)
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
            let weaponReq = GeneralCtrl.getWeaponReq(weapon.name, lvlReq.curLvl, lvlReq.reqLvl);
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