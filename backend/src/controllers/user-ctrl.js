const User = require("../db/models/user-model");
const GeneralCtrl = require("./general-ctrl");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secretOrKey } = require("../config/config");

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

function conUserData(allReq, user) {
    for (let key in allReq) {
        if (key !== "name" && key !== "stars" && key !== "type") {
            if (key === "weaponExp" || key === "charExp") {
                let i = allReq[key].matList.length;
                while (i--) {
                    let userMat = GeneralCtrl.searchArray(allReq[key].matList[i].name, user.userData.materials[key]);
                    if (userMat === null) {
                        allReq[key].matList[i]["imgPath"] = GeneralCtrl.searchArray(allReq[key].matList[i].name, GeneralCtrl.generalData.img).imgPath;
                        continue;
                    }
                    if (allReq[key].matList[i].reqNum <= userMat.number) {
                        allReq[key].matList.splice(i, 1);
                        continue;
                    } else {
                        allReq[key].matList[i].reqNum -= userMat.number;
                    }
                    allReq[key].matList[i]["imgPath"] = userMat.imgPath;
                }
                if (allReq[key].matList.length === 0) {
                    allReq[key].matList = [];
                    allReq[key].wastedExp = 0;
                }
            } else {
                let i = allReq[key].length;
                while (i--) {
                    let userMat = GeneralCtrl.searchArray(allReq[key][i].name, user.userData.materials[key]);
                    if ("matList" in allReq[key][i]) {
                        let j = allReq[key][i].matList.length;
                        while (j--) {
                            let userInnerMat = GeneralCtrl.searchArray(allReq[key][i].matList[j].name, userMat.matList);
                            if (userInnerMat === null) {
                                allReq[key][i].matList[j]["imgPath"] = GeneralCtrl.searchArray(allReq[key][i].matList[j].name, GeneralCtrl.generalData.img).imgPath;
                                continue;
                            };
                            if (allReq[key][i].matList[j].reqNum <= userInnerMat.number) {
                                allReq[key][i].matList.splice(j, 1);
                                continue;
                            } else {
                                allReq[key][i].matList[j].reqNum -= userInnerMat.number;
                            }
                            allReq[key][i].matList[j]["imgPath"] = userInnerMat.imgPath;
                        }
                        if (allReq[key][i].matList.length === 0) {
                            allReq[key].splice(i, 1);
                        }
                    } else {
                        if (userMat === null) {
                            allReq[key][i]["imgPath"] = GeneralCtrl.searchArray(allReq[key][i].name, GeneralCtrl.generalData.img).imgPath;
                            continue;
                        }
                        if (allReq[key][i].reqNum <= userMat.number) {
                            allReq[key].splice(i, 1);
                            continue;
                        } else {
                            allReq[key][i].reqNum -= userMat.number;
                        }
                        allReq[key][i]["imgPath"] = userMat.imgPath;
                    }
                }
            }
        }
    }
    return allReq;
}

// Not sure how I want to store sorting arrays. Build from general, or add to miscData?
// function sortObj(obj) {
//     for (let key in obj) {
//         if (key !== "name" && key !== "stars" && key !== "type") {
//             if (key === "weaponExp" || key === "charExp") {
//
//                 obj[key].matList.sort((a, b) => {
//
//                 })
//             }
//         }
//     }
// }

createUser = (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ existingAcc: "Email already exists" });
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
                .catch(err => res.json({error: err }));
            });
        });
    }).catch(err => res.json({error: err}));
}

loginUser = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ invalidLogin: "Email or password is incorrect" });
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
                    username: user.username,
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
                    .json({ invalidLogin: "Email or password is incorrect" });
            }
        }).catch(err => res.json({error: err}));
    }).catch(err => res.json({error: err}));
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
                return res.json({ error: "Could not update user data" })
            });
    });
}

// Get user data
getUserData = (req, res) => {
    if (req.token === "Unauthorized") {
        res.status(401).json({ error: "Unauthorized"});
    }
    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(500).json({ error: "Could not connect"});
        }
        User.findOne({ email: data.email }).then(user => {
            res.json({ userData: user.userData });
        }).catch(err => console.log(err));
    });
}

// Get list of characters, materials, weapons
getGeneralData = (req, res) => {
    let generalData = GeneralCtrl.generalData;
    let charList = generalData.characters.charList;
    for (let i=0; i<charList.length; i++) {
        charList[i]["imgPath"] = GeneralCtrl.searchArray(charList[i].name, GeneralCtrl.generalData.img).imgPath;
        charList[i].talents["aaImgPath"] = GeneralCtrl.searchArray(charList[i].talents.autoAttack, GeneralCtrl.generalData.img).imgPath;
        charList[i].talents["esImgPath"] = GeneralCtrl.searchArray(charList[i].talents.eleSkill, GeneralCtrl.generalData.img).imgPath;
        charList[i].talents["ebImgPath"] = GeneralCtrl.searchArray(charList[i].talents.eleBurst, GeneralCtrl.generalData.img).imgPath;
    }
    let send = {
        charList: charList,
        weaponList: generalData.weapons.weaponList,
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
            return res.status(500).json({ error: "Could not connect"});
        }
        User.findOne({ email: data.email }).then(user => {
            let charReq = GeneralCtrl.getAllCharReq(user.userData.charList);
            let weaponReq = GeneralCtrl.getAllWeaponReq(user.userData.weaponList);
            let talentReq = GeneralCtrl.getAllTalentReq(user.userData.charList);
            let allReq = addObjects(charReq, weaponReq, talentReq);
            allReq = conUserData(allReq, user);
            return res.json(allReq);
        }).catch(err => res.json({ error: err }));
    });
}

// Gets all requirements for all characters and talents
getCalcAllCharReq = (req, res) => {
    if (req.token === "Unauthorized") {
        return res.status(401).json({ error: "Unauthorized"});
    }
    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Could not connect" });
        }
        User.findOne({ email: data.email }).then(user => {
            let allCharReq = GeneralCtrl.getAllCharReq(user.userData.charList);
            let talentReq = GeneralCtrl.getAllTalentReq(user.userData.charList);
            allCharReq = addObjects(allCharReq, talentReq);
            allCharReq = conUserData(allCharReq, user);
            return res.json(allCharReq);
        }).catch(err => res.json({ error: err }));
    });
}

// Gets all requirements for single character and all character's talents
getCalcCharReq = (req, res) => {
    if (req.token === "Unauthorized") {
        let character = GeneralCtrl.searchArray(convertToName(req.params.name), GeneralCtrl.generalData.characters.charList);
        if (character === null) {
            return res.status(404).json({ error: "Character does not exist"});
        }
        let charReq = GeneralCtrl.getCharReq(character.name, 1, 90);
        for (let key in charReq) {
            if (key !== "name" && key !== "stars") {
                if (key === "charExp") {
                    for (let i=0; i<charReq[key].matList.length; i++) {
                        let imgPath = GeneralCtrl.searchArray(charReq[key].matList[i].name, GeneralCtrl.generalData.img).imgPath;
                        charReq[key].matList[i]["imgPath"] = imgPath;
                    }
                } else {
                    for (let i=0; i<charReq[key].length; i++) {
                        if ("matList" in charReq[key][i]) {
                            for (let j=0; j<charReq[key][i].matList.length; j++) {
                                let imgPath = GeneralCtrl.searchArray(charReq[key][i].matList[j].name, GeneralCtrl.generalData.img).imgPath;
                                charReq[key][i].matList[j]["imgPath"] = imgPath;
                            }
                        } else {
                            let imgPath = GeneralCtrl.searchArray(charReq[key][i].name, GeneralCtrl.generalData.img).imgPath;
                            charReq[key][i]["imgPath"] = imgPath;
                        }
                    }
                }
            }
        }
        return res.json(charReq);
    }
    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Could not connect" });
        }
        User.findOne({ email: data.email }).then(user => {
            let lvlReq = GeneralCtrl.searchArray(convertToName(req.params.name), user.userData.charList);
            if (lvlReq === null) {
                return res.json({ error: "Character not in userData" });
            }
            let charReq = GeneralCtrl.getCharReq(lvlReq.name, lvlReq.curLvl, lvlReq.reqLvl);
            let talentReq = GeneralCtrl.getAllTalentReq([lvlReq]);
            charReq = addObjects(charReq, talentReq);
            charReq = conUserData(charReq, user);
            return res.json(charReq);
        }).catch(err => res.json({ error: err }));
    });
}

// Gets all requirements for each of a character's single talent
getCalcTalentReq = (req, res) => {
    if (req.token === "Unauthorized") {
        return res.status(401).json({ error: "Unauthorized"});
    }
    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Could not connect" });
        }
        User.findOne({ email: data.email }).then(user => {
            let lvlReq = GeneralCtrl.searchArray(convertToName(req.params.name), user.userData.charList);
            let talentReq = {
                autoAttack: null,
                eleSkill: null,
                eleBurst: null,
            }
            let character = GeneralCtrl.searchArray(lvlReq.name, GeneralCtrl.generalData.characters.charList);
            for (let talent in talentReq) {
                let curReq = GeneralCtrl.getTalentReq(lvlReq.name, lvlReq[talent].curLvl, lvlReq[talent].reqLvl, talent);
                curReq = conUserData(curReq, user);
                talentReq[talent] = curReq;
            }
            return res.json(talentReq);
        }).catch(err => res.json({ error: err }));
    });
}

// Gets all requirements for all weapons
getCalcAllWeaponReq = (req, res) => {
    if (req.token === "Unauthorized") {
        return res.status(401).json({ error: "Unauthorized"});
    }
    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Could not connect" });
        }
        User.findOne({ email: data.email }).then(user => {
            let weaponReq = GeneralCtrl.getAllWeaponReq(user.userData.weaponList);
            weaponReq = conUserData(weaponReq, user);
            return res.json(weaponReq);
        }).catch(err => res.json({ error: err }));
    });
}

// Gets all requirements for single weapon
getCalcWeaponReq = (req, res) => {
    if (req.token === "Unauthorized") {
        let weapon = GeneralCtrl.searchArray(convertToName(req.params.name), GeneralCtrl.generalData.weapons.weaponList);
        if (weapon === null) {
            return res.status(404).json({ error: "Weapon does not exist" });
        }
        let level = GeneralCtrl.searchArray(weapon.stars, GeneralCtrl.generalData.weapons.weaponLevel).weaponStarLevel;
        let lastLevel = level[level.length-1];
        let weaponReq = GeneralCtrl.getWeaponReq(weapon.name, 1, lastLevel.level);
        for (let key in weaponReq) {
            if (key !== "name" && key !== "stars" && key !== "type") {
                if (key === "weaponExp") {
                    for (let i=0; i<weaponReq[key].matList.length; i++) {
                        let imgPath = GeneralCtrl.searchArray(weaponReq[key].matList[i].name, GeneralCtrl.generalData.img).imgPath;
                        weaponReq[key].matList[i]["imgPath"] = imgPath;
                    }
                } else {
                    for (let i=0; i<weaponReq[key].length; i++) {
                        if ("matList" in weaponReq[key][i]) {
                            for (let j=0; j<weaponReq[key][i].matList.length; j++) {
                                let imgPath = GeneralCtrl.searchArray(weaponReq[key][i].matList[j].name, GeneralCtrl.generalData.img).imgPath;
                                weaponReq[key][i].matList[j]["imgPath"] = imgPath;
                            }
                        } else {
                            let imgPath = GeneralCtrl.searchArray(weaponReq[key][i].name, GeneralCtrl.generalData.img).imgPath;
                            weaponReq[key][i]["imgPath"] = imgPath;
                        }
                    }
                }
            }
        }
        return res.json(weaponReq);
    }
    jwt.verify(req.token, secretOrKey, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Could not connect" });
        }
        User.findOne({ email: data.email }).then(user => {
            let weapon = GeneralCtrl.searchArray(convertToName(req.params.name), GeneralCtrl.generalData.weapons.weaponList);
            if (weapon === null) {
                return res.status(404).json({ error: "Weapon does not exist"});
            }
            let lvlReq = GeneralCtrl.searchArray(weapon.name, user.userData.weaponList);
            if (lvlReq === null) {
                return res.json({ error: "Weapon not in userData" });
            }
            let weaponReq = GeneralCtrl.getWeaponReq(weapon.name,lvlReq.curLvl, lvlReq.reqLvl, weapon.number);
            weaponReq = conUserData(weaponReq, user);
            return res.json(weaponReq);
        }).catch(err => res.json({ error: err }));
    });
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
};
