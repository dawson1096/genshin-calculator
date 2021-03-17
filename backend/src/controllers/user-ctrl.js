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
        for (let i = 0; i < req2[key].length; i++) {
          let curMat = GeneralCtrl.searchArray(req2[key][i].name, req1[key]);
          if (curMat === null) {
            req1[key].push(req2[key][i]);
          } else {
            if ("matList" in curMat) {
              for (let j = 0; j < req2[key][i].matList.length; j++) {
                let found = false;
                for (let k = 0; k < curMat.matList.length; k++) {
                  if (req2[key][i].matList[j].name === curMat.matList[k].name) {
                    curMat.matList[k].reqNum += req2[key][i].matList[j].reqNum;
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  curMat.matList.push(req2[key][i].matList[j]);
                }
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

function conUserData(allReq, materials, con = true) {
  for (let key in allReq) {
    if (key !== "name" && key !== "stars" && key !== "type") {
      if (key === "weaponExp" || key === "charExp") {
        let i = allReq[key].matList.length;
        while (i--) {
          let userMat = GeneralCtrl.searchArray(
            allReq[key].matList[i].name,
            materials[key]
          );
          if (userMat === null) {
            allReq[key].matList[i]["imgPath"] = GeneralCtrl.searchArray(
              allReq[key].matList[i].name,
              GeneralCtrl.generalData.img
            ).imgPath;
            continue;
          }
          if (con) {
            if (allReq[key].matList[i].reqNum <= userMat.number) {
              allReq[key].matList.splice(i, 1);
              continue;
            } else {
              allReq[key].matList[i].reqNum -= userMat.number;
            }
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
          let userMat = GeneralCtrl.searchArray(
            allReq[key][i].name,
            materials[key]
          );
          if ("matList" in allReq[key][i]) {
            let j = allReq[key][i].matList.length;
            while (j--) {
              let userInnerMat = GeneralCtrl.searchArray(
                allReq[key][i].matList[j].name,
                userMat.matList
              );
              if (userInnerMat === null) {
                allReq[key][i].matList[j]["imgPath"] = GeneralCtrl.searchArray(
                  allReq[key][i].matList[j].name,
                  GeneralCtrl.generalData.img
                ).imgPath;
                continue;
              }
              if (con) {
                if (allReq[key][i].matList[j].reqNum <= userInnerMat.number) {
                  allReq[key][i].matList.splice(j, 1);
                  continue;
                } else {
                  allReq[key][i].matList[j].reqNum -= userInnerMat.number;
                }
              }
              allReq[key][i].matList[j]["imgPath"] = userInnerMat.imgPath;
            }
            if (allReq[key][i].matList.length === 0) {
              allReq[key].splice(i, 1);
            }
          } else {
            if (userMat === null) {
              allReq[key][i]["imgPath"] = GeneralCtrl.searchArray(
                allReq[key][i].name,
                GeneralCtrl.generalData.img
              ).imgPath;
              continue;
            }
            if (con) {
              if (allReq[key][i].reqNum <= userMat.number) {
                allReq[key].splice(i, 1);
                continue;
              } else {
                allReq[key][i].reqNum -= userMat.number;
              }
            }
            allReq[key][i]["imgPath"] = userMat.imgPath;
          }
        }
      }
    }
  }
  return allReq;
}

function convertToArray(obj) {
  let arr = [];
  Object.keys(obj).forEach((key) => {
    if (
      key === "eleCrys" ||
      key === "weaponMat" ||
      key === "eliteMat" ||
      key === "comMat" ||
      key === "talentMat"
    ) {
      obj[key].forEach((curMat) => {
        curMat.matList.forEach((curItem) => {
          arr.push(curItem);
        });
      });
    } else if (
      key === "eleMat" ||
      key === "locSpec" ||
      key === "bossMat" ||
      key === "misc"
    ) {
      obj[key].forEach((curMat) => {
        arr.push(curMat);
      });
    } else if (key === "charExp" || key === "weaponExp") {
      obj[key].matList.forEach((curMat) => {
        arr.push(curMat);
      });
    }
  });
  return arr;
}

function updateData(user) {
  let materials = GeneralCtrl.generalData.materials;
  let userData = user.userData.materials;
  for (let key in materials) {
    if (key in userData) {
      for (let i = 0; i < materials[key].length; i++) {
        if ("type" in materials[key][i]) {
          let curMat = GeneralCtrl.searchArray(
            materials[key][i].name,
            userData[key]
          );
          let imgPath = GeneralCtrl.searchArray(
            materials[key][i].name,
            GeneralCtrl.generalData.img
          ).imgPath;
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
          let curMatShort = GeneralCtrl.searchArray(
            materials[key][i].name,
            userData[key]
          );
          if (curMatShort !== null) {
            for (let type in materials[key][i]) {
              if (type !== "name" && materials[key][i][type] !== null) {
                let curMat = GeneralCtrl.searchArray(
                  materials[key][i][type],
                  curMatShort.matList
                );
                let imgPath = GeneralCtrl.searchArray(
                  materials[key][i][type],
                  GeneralCtrl.generalData.img
                ).imgPath;
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
                let imgPath = GeneralCtrl.searchArray(
                  materials[key][i][type],
                  GeneralCtrl.generalData.img
                ).imgPath;
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
      for (let i = 0; i < materials[key].length; i++) {
        if ("type" in materials[key][i]) {
          let imgPath = GeneralCtrl.searchArray(
            materials[key][i].name,
            GeneralCtrl.generalData.img
          ).imgPath;
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
              let imgPath = GeneralCtrl.searchArray(
                materials[key][i][type],
                GeneralCtrl.generalData.img
              ).imgPath;
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
  return userData;
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
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ existingAcc: "Email already exists" });
      }
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        userData: req.body.userData,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => res.json({ error: err }));
        });
      });
    })
    .catch((err) => res.json({ error: err }));
};

loginUser = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email })
    .then((user) => {
      // Check if user exists
      if (!user) {
        return res
          .status(404)
          .json({ invalidLogin: "Email or password is incorrect" });
      }
      // Check password
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            // Create JWT Payload
            const payload = {
              id: user.id,
              username: user.username,
              email: user.email,
            };
            // Sign token
            jwt.sign(
              payload,
              secretOrKey,
              { expiresIn: 31556926 },
              (err, token) => {
                return res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              }
            );
          } else {
            return res
              .status(400)
              .json({ invalidLogin: "Email or password is incorrect" });
          }
        })
        .catch((err) => res.json({ error: err }));
    })
    .catch((err) => res.json({ error: err }));
};

checkToken = (req, res, next) => {
  const header = req.headers["authorization"];
  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];
    req.token = token;
  } else {
    req.token = "Unauthorized";
  }
  next();
};

// Update or create user data
updateUserData = (req, res) => {
  if (req.token === "Unauthorized") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(req.token, secretOrKey, (err, data) => {
    if (err) {
      console.log("ERROR: Could not connect to the protected route");
      return res.status(500).json({ error: "Could not connect" });
    }
    User.updateOne({ email: data.email }, { $set: { userData: req.body } })
      .then(() => res.json({ success: true }))
      .catch(() => res.json({ error: "Could not update user data" }));
  });
};

// Get user data
getUserData = (req, res) => {
  if (req.token === "Unauthorized") {
    return res.json({
      userData: {
        charList: [],
        weaponList: [],
        materials: updateData({ userData: { materials: {} } }),
      },
    });
  }
  jwt.verify(req.token, secretOrKey, (err, data) => {
    if (err) {
      console.log("ERROR: Could not connect to the protected route");
      res.status(500).json({ error: "Could not connect" });
    }
    User.findOne({ email: data.email })
      .then((user) =>
        User.findOneAndUpdate(
          { email: user.email },
          { $set: { "userData.materials": updateData(user) } }
        )
      )
      .then((user) => {
        return res.json({ userData: user.userData });
      })
      .catch((err) => console.log(err));
  });
};

// Get list of characters, materials, weapons
getGeneralData = (req, res) => {
  let generalData = GeneralCtrl.generalData;
  let charList = generalData.characters.charList;
  let weaponList = generalData.weapons.weaponList;
  for (let i = 0; i < charList.length; i++) {
    charList[i]["imgPath"] = GeneralCtrl.searchArray(
      charList[i].name,
      GeneralCtrl.generalData.img
    ).imgPath;
    charList[i].talents["aaImgPath"] = GeneralCtrl.searchArray(
      charList[i].talents.autoAttack,
      GeneralCtrl.generalData.img
    ).imgPath;
    charList[i].talents["esImgPath"] = GeneralCtrl.searchArray(
      charList[i].talents.eleSkill,
      GeneralCtrl.generalData.img
    ).imgPath;
    charList[i].talents["ebImgPath"] = GeneralCtrl.searchArray(
      charList[i].talents.eleBurst,
      GeneralCtrl.generalData.img
    ).imgPath;
  }

  for (let i = 0; i < weaponList.length; i++) {
    weaponList[i]["imgPath"] = GeneralCtrl.searchArray(
      weaponList[i].name,
      GeneralCtrl.generalData.img
    ).imgPath;
  }

  let send = {
    charList: charList,
    weaponList: weaponList,
    materials: generalData.materials,
  };
  res.json(send);
};

// Gets all requirements for all weapons, characters, and talents
getAllReq = (req, res) => {
  let charReq = GeneralCtrl.getAllCharReq(req.body.charList);
  let weaponReq = GeneralCtrl.getAllWeaponReq(req.body.weaponList);
  let talentReq = GeneralCtrl.getAllTalentReq(req.body.charList);
  let allReq = addObjects(charReq, weaponReq, talentReq);
  allReq = conUserData(allReq, req.body.materials);
  return res.json(allReq);
};

// Gets all requirements for all characters and talents
getCalcAllCharReq = (req, res) => {
  const { charList, materials } = req.body;
  let allCharReq = GeneralCtrl.getAllCharReq(charList);
  let talentReq = GeneralCtrl.getAllTalentReq(charList);
  allCharReq = addObjects(allCharReq, talentReq);
  allCharReq = conUserData(allCharReq, materials);
  return res.json(allCharReq);
};

// Gets all level requirements for single character
getCalcCharReq = (req, res) => {
  const { char, materials } = req.body;
  let charReq = GeneralCtrl.getCharReq(char.name, char.curLvl, char.reqLvl);
  charReq = conUserData(charReq, materials, char.inventory);
  let resData = {
    arrMat: [],
  };
  resData.arrMat = convertToArray(charReq);
  return res.json(resData);
};

// Gets total or individual talent requirements for a single character
getCalcTalentReq = (req, res) => {
  const { char, materials } = req.body;

  let talentReq = {
    autoAttack: null,
    eleSkill: null,
    eleBurst: null,
  };
  for (let talent in talentReq) {
    let curReq = GeneralCtrl.getTalentReq(
      char.name,
      char[talent].curLvl,
      char[talent].reqLvl,
      talent
    );
    curReq = conUserData(curReq, materials, char.inventory);
    talentReq[talent] = curReq;
  }
  if (char.talentTotal) {
    let total = addObjects(
      talentReq.autoAttack,
      talentReq.eleSkill,
      talentReq.eleBurst
    );
    let resData = {
      arrMat: [],
    };
    resData.arrMat = convertToArray(total);
    talentReq.total = resData;
    delete talentReq.autoAttack;
    delete talentReq.eleSkill;
    delete talentReq.eleBurst;
  } else {
    let resData = {
      arrMat: [],
    };
    resData.arrMat = convertToArray(talentReq.autoAttack);
    talentReq.autoAttack = resData;
    resData = {
      arrMat: [],
    };
    resData.arrMat = convertToArray(talentReq.eleBurst);
    talentReq.eleBurst = resData;
    resData = {
      arrMat: [],
    };
    resData.arrMat = convertToArray(talentReq.eleSkill);
    talentReq.eleSkill = resData;
  }
  return res.json(talentReq);
};

// Gets all requirements for all weapons
getCalcAllWeaponReq = (req, res) => {
  const { weaponList, materials } = req.body;
  let weaponReq = GeneralCtrl.getAllWeaponReq(weaponList);
  weaponReq = conUserData(weaponReq, materials);
  return res.json(weaponReq);
};

// Gets all requirements for single weapon
getCalcWeaponReq = (req, res) => {
  const { weapon, materials } = req.body;
  if (weapon === null) {
    return res.json({ error: "Weapon not in userData" });
  }
  let weaponReq = GeneralCtrl.getWeaponReq(
    weapon.name,
    weapon.curLvl,
    weapon.reqLvl,
    weapon.number
  );
  weaponReq = conUserData(weaponReq, materials);
  let resData = {
    arrMat: [],
  };
  resData.arrMat = convertToArray(weaponReq);
  return res.json(resData);
};

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
