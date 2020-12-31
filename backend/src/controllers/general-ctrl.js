const fs = require("fs");
const { get } = require("http");
const path = require("path");

let data = fs.readFileSync(path.resolve(__dirname, '../assets/general.json'));
let generalData = JSON.parse(data);
let miscData = generalData.miscData;

// Searches for searchKey which can be 'name', 'level' or 'stars' in given array of objects
function searchArray(searchKey, array) {
    if (array.length === 0) return null;

    let key = "name" in array[0] ? "name" : "level" in array[0] ? "level" : "stars";

    for (let i =0; i<array.length; i++) {
        let value = array[i][key]

        if (searchKey === value) {
            return array[i];
        }
    }

    return null;
}

// Returns the full material name and type given the short name, material type, and rarity type (optional)
function getMatNameType(name, matType, type = null) {
    if (name === null) {
        return null;
    }
    let match = searchArray(name, generalData.materials[matType]);
    if (match !== null) {
        let nameAndType = {
            name: null,
            type: null,
        };

        if ("type" in match) {
            nameAndType["name"] = match.name;
            nameAndType["type"] = match.type
        } else if (match[type] !== null){
            nameAndType["name"] = match[type];
            nameAndType["type"] = type
            
        } else {
            return null;
        }

        return nameAndType;
    }
    console.log("ERROR: Name not found");
    return null;
}

// Returns an object of talent and ascension requirements for a character at each ascension/talent level
function getGenCharReq(name) {
    let char = searchArray(name, generalData.charList);
    let charReq = {
        name: char.name,
        stars: char.stars,
        ascenReq: [],
        talentReq: [],
    };

    let levels = miscData.charAscenLevels;

    for (let i=0; i<levels.length; i++) {
        let ascenLevelReq = searchArray(levels[i], generalData.charAscension);
        let calcReq = {
            level: null,
            eleCrys: null,
            eleCrysType: null,
            eleCrysNum: null,
            eleMat: null,
            eleMatType: null,
            eleMatNum: null,
            locSpec: null,
            locSpecType: null,
            locSpecNum: null,
            comMat: null,
            comMatType: null,
            comMatNum:null,
            mora: null
        };

        calcReq["level"] = levels[i];
        let eleCrys = getMatNameType(char.eleCrys,"eleCrys", ascenLevelReq.eleCrysType);
        calcReq["eleCrys"] = eleCrys.name;
        calcReq["eleCrysType"] = eleCrys.type;
        calcReq["eleCrysNum"] = ascenLevelReq.eleCrysNum;
        let eleMat = getMatNameType(char.eleMat, "eleMat");
        calcReq["eleMat"] = eleMat ? eleMat.name : null;
        calcReq["eleMatType"] = eleMat ? eleMat.type : null;
        calcReq["eleMatNum"] = eleMat ? ascenLevelReq.eleMatNum : 0;
        let locSpec = getMatNameType(char.locSpec, "locSpec");
        calcReq["locSpec"] = locSpec.name;
        calcReq["locSpecType"] = locSpec.type;
        calcReq["locSpecNum"] = ascenLevelReq.locSpecNum;
        let comMat = getMatNameType(char.comMat,"comMat", ascenLevelReq.comMatType);
        calcReq["comMat"] = comMat.name;
        calcReq["comMatType"] = comMat.type;
        calcReq["comMatNum"] = ascenLevelReq.comMatNum;
        calcReq["mora"] = ascenLevelReq.mora;

        charReq["ascenReq"].push(calcReq);
    }

    let talentLevels = miscData.talentLevels;

    let travTalentMat;
    let isTravelerTalentNum = 1;
    let curTalent = ["autoAttack", "eleSkill", "eleBurst"];
    if (char.isTraveler) {
        let ele = char.name.split(' ')[1].toLowerCase();
        travTalentMat = miscData.traveler[ele];
        isTravelerTalentNum = 3;
        charReq.talentReq = {
            autoAttack: [],
            eleSkill: [],
            eleBurst: [],
        };
    }

    for (let j=0; j<isTravelerTalentNum; j++) {
        for (let i=0; i<talentLevels.length; i++) {
            let talentReq = searchArray(talentLevels[i], generalData.talents);
            let calcReq = {
                level: null,
                talentMat: null,
                talentMatType: null,
                talentMatNum: null,
                comMat: null,
                comMatType: null,
                comMatNum: null,
                bossMat: null,
                bossMatType: null,
                bossMatNum: null,
                // crown: null,
                // crownType: null,
                crownNum: null,
                mora: null,
            }

            calcReq["level"] = talentLevels[i];
            calcReq["crownNum"] = talentReq.crownNum;
            calcReq["mora"] = talentReq.mora;
            let talentMat = getMatNameType(char.talentMat, "talentMat", talentReq.talentMatType);
            calcReq["talentMatType"] = talentReq.talentMatType
            calcReq["talentMatNum"] = talentReq.talentMatNum;
            let comMat = getMatNameType(char.comMat, "comMat", talentReq.comMatType);
            calcReq["comMatType"] = talentReq.comMatType
            calcReq["comMatNum"] = talentReq.comMatNum;
            let bossMat = getMatNameType(char.bossMat, "bossMat");
            calcReq["bossMatType"] = "gold";
            calcReq["bossMatNum"] = talentReq.bossMatNum;

            if (char.isTraveler) {
                calcReq["talentMat"] = travTalentMat[curTalent[j]].talentMat[i%3];
                calcReq["comMat"] = travTalentMat[curTalent[j]].comMat;
                calcReq["bossMat"] = travTalentMat[curTalent[j]].bossMat;
                charReq["talentReq"][curTalent[j]].push(calcReq);
            } else {
                calcReq["talentMat"] = talentMat.name;
                calcReq["comMat"] = comMat.name;
                calcReq["bossMat"] = bossMat.name;
                charReq["talentReq"].push(calcReq)
            }

            
        }
    }

    return charReq;
}

// Returns an object of ascension requirements for a weapon at each ascension level
function getGenWeaponReq(name) {
    let weapon = searchArray(name, generalData.weaponList);
    let weaponReq = {
        name: weapon.name,
        stars: weapon.stars,
        type: weapon.type,
        ascenReq: [],
    };

    let starAscenArray = searchArray(weapon.stars, generalData.weaponAscension).weaponStarAscen;
    let levels = searchArray(weapon.stars, miscData.weaponStars).weaponAscenLevels;

    for(let i=0; i<levels.length; i++) {
        let ascenLevelReq = searchArray(levels[i], starAscenArray);
        let calcReq = {
            level: null,
            weaponMat: null,
            weaponMatType: null,
            weaponMatNum: null,
            eliteMat: null,
            eliteMatType: null,
            eliteMatNum:null,
            comMat: null,
            comMatType: null,
            comMatNum:null,
            mora: null
        };

        calcReq["level"] = levels[i];
        let weaponMat = getMatNameType(weapon.weaponMat, "weaponMat", ascenLevelReq.weaponMatType);
        calcReq["weaponMat"] = weaponMat.name;
        calcReq["weaponMatType"] = weaponMat.type;
        calcReq["weaponMatNum"] = ascenLevelReq.weaponMatNum;
        let eliteMat = getMatNameType(weapon.eliteMat, "eliteMat", ascenLevelReq.eliteMatType);
        calcReq["eliteMat"] = eliteMat.name;
        calcReq["eliteMatType"] = eliteMat.type;
        calcReq["eliteMatNum"] = ascenLevelReq.eliteMatNum;
        let comMat = getMatNameType(weapon.comMat, "comMat", ascenLevelReq.comMatType);
        calcReq["comMat"] = comMat.name;
        calcReq["comMatType"] = comMat.type;
        calcReq["comMatNum"] = ascenLevelReq.comMatNum;
        calcReq["mora"] = ascenLevelReq.mora;

        weaponReq["ascenReq"].push(calcReq);
    }

    return weaponReq;
}

// This will return an object of exp materials requied for exp given an array of expMat
function calcExpMatReq(exp, type) {
    if (exp === 0) return null;

    let expMat;
    let matReq = {
        matList: [],
        wastedExp: 0,
    };

    if (type === "weapon") {
        expMat = generalData.materials.weaponExp;
    } else if (type === "char") {
        expMat = generalData.materials.charExp;
    } else {
        console.log("ERROR: Invalid exp type");
    }

    for (let i=0; i<expMat.length; i++) {
        let curReq = {
            name: expMat[i].name,
            type: expMat[i].type,
            reqNum: 0,
        };
        if (exp > expMat[i].exp) {
            let matNum;
            if (i === expMat.length - 1) {
                matNum = Math.ceil(exp / expMat[i].exp);
            } else {
                matNum = Math.floor(exp / expMat[i].exp);
            }
            curReq.reqNum = matNum;
            exp = exp - (matNum * expMat[i].exp);
            matReq.matList.push(curReq);
        }
    }

    if (exp > 0) {
        let lastExp = searchArray(expMat[expMat.length - 1].name, matReq.matList);
        if (lastExp === null) {
            let curReq = {
                name: expMat[expMat.length - 1].name,
                type: expMat[expMat.length - 1].type,
                reqNum: 1,
            };
            matReq.matList.push(curReq);
        } else {
            lastExp.reqNum += 1;
        }
        exp = exp - expMat[expMat.length - 1].exp;
    }

    matReq.wastedExp = Math.abs(exp);

    return matReq;
}

// This will return and object of the weapon exp materials required to reach reqLvl from curLvl and the mora required including ascension costs
function getWeaponExpMatReq(stars, curLvl, reqLvl, number = 1) {
    let levels = searchArray(stars, generalData.weaponLevel).weaponStarLevel;
    let curLvlStats = searchArray(Math.floor(curLvl), levels);
    let reqLvlStats = searchArray(Math.floor(reqLvl), levels);
    let ascenLevels = searchArray(stars, miscData.weaponStars).weaponAscenLevels;
    let weaponExpReq = {
        matList: [],
        wastedExp: 0,
        mora: 0,
    };

    weaponExpReq.mora = (reqLvlStats.cumulMora - curLvlStats.cumulMora) * number;

    for (let i=0; i<ascenLevels.length; i++) {
        if (curLvlStats.level < ascenLevels[i] && reqLvl > ascenLevels[i]) {
            let curReqStats = searchArray(ascenLevels[i], levels);
            let expReq = curReqStats.cumulExp - curLvlStats.cumulExp;
            let curMatReq = calcExpMatReq(expReq, "weapon");
            weaponExpReq.wastedExp += (curMatReq.wastedExp * number);
            for (let i=0; i<curMatReq.matList.length; i++) {
                let curExpMat = searchArray(curMatReq.matList[i].name, weaponExpReq.matList);
                if (curExpMat === null) {
                    curMatReq.matList[i].reqNum *= number;
                    weaponExpReq.matList.push(curMatReq.matList[i]);
                } else {
                    curExpMat.reqNum += (curMatReq.matList[i].reqNum * number);
                }
            }
            curLvlStats = curReqStats;
        }
    }
    let remExpReq = reqLvlStats.cumulExp - curLvlStats.cumulExp;
    if (remExpReq === 0) return weaponExpReq;

    let curMatReq = calcExpMatReq(remExpReq, "weapon");
    weaponExpReq.wastedExp += (curMatReq.wastedExp * number);

    for (let i=0; i<curMatReq.matList.length; i++) {
        let curExpMat = searchArray(curMatReq.matList[i].name, weaponExpReq.matList);
        if (curExpMat === null) {
            curMatReq.matList[i].reqNum *= number;
            weaponExpReq.matList.push(curMatReq.matList[i]);
        } else {
            curExpMat.reqNum += (curMatReq.matList[i].reqNum * number);
        }
    }

    return weaponExpReq;
}

// This will return and object of the character exp materials required to reach reqLvl from curLvl and the mora required including ascension costs
function getCharExpMatReq(curLvl, reqLvl) {
    let levels = generalData.charLevel;
    let curLvlStats = searchArray(Math.floor(curLvl), levels);
    let reqLvlStats = searchArray(Math.floor(reqLvl), levels);
    let ascenLevels = miscData.charAscenLevels;
    let charExpReq = {
        matList: [],
        wastedExp: 0,
        mora: 0,
    };

    charExpReq.mora = reqLvlStats.cumulMora - curLvlStats.cumulMora;

    for (let i=0; i<ascenLevels.length; i++) {
        if (curLvlStats.level < ascenLevels[i] && reqLvl > ascenLevels[i]) {
            let curReqStats = searchArray(ascenLevels[i], levels);
            let expReq = curReqStats.cumulExp - curLvlStats.cumulExp;
            let curMatReq = calcExpMatReq(expReq, "char");
            charExpReq.wastedExp += curMatReq.wastedExp;
            for (let i=0; i<curMatReq.matList.length; i++) {
                let curExpMat = searchArray(curMatReq.matList[i].name, charExpReq.matList);
                if (curExpMat === null) {
                    charExpReq.matList.push(curMatReq.matList[i]);
                } else {
                    curExpMat.reqNum += curMatReq.matList[i].reqNum;
                }
            }
            curLvlStats = curReqStats;
        }
    }

    let remExpReq = reqLvlStats.cumulExp - curLvlStats.cumulExp;
    if (remExpReq === 0) return charExpReq;

    let curMatReq = calcExpMatReq(remExpReq, "char");
    charExpReq.wastedExp += curMatReq.wastedExp;

    for (let i=0; i<curMatReq.matList.length; i++) {
        let curExpMat = searchArray(curMatReq.matList[i].name, charExpReq.matList);
        if (curExpMat === null) {
            charExpReq.matList.push(curMatReq.matList[i]);
        } else {
            curExpMat.reqNum += curMatReq.matList[i].reqNum;
        }
    }

    return charExpReq;
}

// Returns an object of total material requirements to reach character level reqLvl
function getCharReq(name, curLvl, reqLvl) {
    let expMat = getCharExpMatReq(curLvl, reqLvl);
    let character = searchArray(name, generalData.charList);
    let ascenReq = generalData.charAscension;
    let mora = getMatNameType("Mora", "misc");
    let charReq = {
        name: character.name,
        stars: character.stars,
        eleCrys: [],
        eleMat: [],
        locSpec: [],
        comMat: [],
        charExp: {
            matList: [],
            wastedExp: 0,
        },
        misc: [
            {
                name: mora.name,
                type: mora.type,
                reqNum: 0,
            },
        ],
    };

    charReq.charExp.matList = expMat.matList;
    charReq.charExp.wastedExp = expMat.wastedExp;
    charReq.misc[0].reqNum += expMat.mora;

    for (let i=0; i<ascenReq.length; i++) {
        if (curLvl <= ascenReq[i].level && reqLvl > ascenReq[i].level) {
            let eleCrys = getMatNameType(character.eleCrys, "eleCrys", ascenReq[i].eleCrysType);
            if (charReq.eleCrys.length === 0) {
                let insert = {
                    name: character.eleCrys,
                    matList: [
                        {
                            name: eleCrys.name,
                            type: eleCrys.type,
                            reqNum: ascenReq[i].eleCrysNum,
                        },
                    ],
                };
                charReq.eleCrys.push(insert);
            } else {
                let curEleCrys = searchArray(eleCrys.name, charReq.eleCrys);
                if (curEleCrys === null) {
                    let insert = {
                        name: eleCrys.name,
                        type: eleCrys.type,
                        reqNum: ascenReq[i].eleCrysNum,
                    };
                    charReq.eleCrys[0].matList.push(insert);
                } else {
                    curEleCrys.reqNum += ascenReq[i].eleCrysNum;
                }
            }

            if (!character.isTraveler) {
                if (charReq.eleMat.length === 0) {
                    let eleMat = getMatNameType(character.eleMat, "eleMat");
                    let insert = {
                        name: eleMat.name,
                        type: eleMat.type,
                        reqNum: ascenReq[i].eleMatNum,
                    };
                    charReq.eleMat.push(insert);
                } else {
                    charReq.eleMat[0].reqNum += ascenReq[i].eleMatNum;
                }
                
            }

            if (charReq.locSpec.length === 0) {
                let locSpec = getMatNameType(character.locSpec, "locSpec");
                let insert = {
                    name: locSpec.name,
                    type: locSpec.type,
                    reqNum: ascenReq[i].locSpecNum,
                };
                charReq.locSpec.push(insert);
            } else {
                charReq.locSpec[0].reqNum += ascenReq[i].locSpecNum;
            }

            let comMat = getMatNameType(character.comMat, "comMat", ascenReq[i].comMatType);
            if (charReq.comMat.length === 0) {
                let insert = {
                    name: character.comMat,
                    matList: [
                        {
                            name: comMat.name,
                            type: comMat.type,
                            reqNum: ascenReq[i].comMatNum,
                        },
                    ],
                };
                charReq.comMat.push(insert);
            } else {
                let curComMat = searchArray(comMat.name, charReq.comMat);
                if (curComMat === null) {
                    let insert = {
                        name: comMat.name,
                        type: comMat.type,
                        reqNum: ascenReq[i].comMatNum,
                    };
                    charReq.comMat[0].matList.push(insert);
                } else {
                    curComMat.reqNum += ascenReq[i].comMatNum;
                }
            }

            charReq.misc[0].reqNum += ascenReq[i].mora;
        }
    }

    return charReq;
}

// Returns an object of total material requirements to reach weapon level reqLvl
function getWeaponReq(name, curLvl, reqLvl, number = 1) {
    let weapon = searchArray(name, generalData.weaponList);
    let expMat = getWeaponExpMatReq(weapon.stars, curLvl, reqLvl, number);
    let ascenReq = searchArray(weapon.stars, generalData.weaponAscension).weaponStarAscen;
    let mora = getMatNameType("Mora", "misc");
    let weaponReq = {
        name: weapon.name,
        stars: weapon.stars,
        type: weapon.type,
        weaponMat: [],
        eliteMat: [],
        comMat: [],
        weaponExp: {
            matList: [],
            wastedExp: 0,
        },
        misc: [
            {
                name: mora.name,
                type: mora.type,
                reqNum: 0,
            },
        ],
    };

    weaponReq.weaponExp.matList = expMat.matList;
    weaponReq.weaponExp.wastedExp = expMat.wastedExp;
    weaponReq.misc[0].reqNum += expMat.mora; 

    for (let i=0; i<ascenReq.length; i++) {
        if (curLvl <= ascenReq[i].level && reqLvl > ascenReq[i].level) {
            let weaponMat = getMatNameType(weapon.weaponMat, "weaponMat", ascenReq[i].weaponMatType);
            if (weaponReq.weaponMat.length === 0) {
                let insert = {
                    name: weapon.weaponMat,
                    matList: [
                        {
                            name: weaponMat.name,
                            type: weaponMat.type,
                            reqNum: ascenReq[i].weaponMatNum,
                        },
                    ],
                };
                weaponReq.weaponMat.push(insert);
            } else {
                let curWeaponMat = searchArray(weaponMat.name, weaponReq.weaponMat);
                if (curWeaponMat === null) {
                    let insert = {
                        name: weaponMat.name,
                        type: weaponMat.type,
                        reqNum: ascenReq[i].weaponMatNum,
                    };
                    weaponReq.weaponMat[0].matList.push(insert);
                } else {
                    curWeaponMat.reqNum += ascenReq[i].weaponMatNum;
                }
            }

            let eliteMat = getMatNameType(weapon.eliteMat, "eliteMat", ascenReq[i].eliteMatType);
            if (weaponReq.eliteMat.length === 0) {
                let insert = {
                    name: weapon.eliteMat,
                    matList: [
                        {
                            name: eliteMat.name,
                            type: eliteMat.type,
                            reqNum: ascenReq[i].eliteMatNum,
                        },
                    ],
                };
                weaponReq.eliteMat.push(insert);
            } else {
                let curEliteMat = searchArray(eliteMat.name, weaponReq.eliteMat);
                if (curEliteMat === null) {
                    let insert = {
                        name: eliteMat.name,
                        type: eliteMat.type,
                        reqNum: ascenReq[i].eliteMatNum,
                    };
                    weaponReq.eliteMat[0].matList.push(insert);
                } else {
                    curEliteMat.reqNum += ascenReq[i].eliteMatNum;
                }
            }

            let comMat = getMatNameType(weapon.comMat, "comMat", ascenReq[i].comMatType);
            if (weaponReq.comMat.length === 0) {
                let insert = {
                    name: weapon.comMat,
                    matList: [
                        {
                            name: comMat.name,
                            type: comMat.type,
                            reqNum: ascenReq[i].comMatNum,
                        },
                    ],
                };
                weaponReq.comMat.push(insert);
            } else {
                let curComMat = searchArray(comMat.name, weaponReq.comMat);
                if (curComMat === null) {
                    let insert = {
                        name: comMat.name,
                        type: comMat.type,
                        reqNum: ascenReq[i].comMatNum,
                    };
                    weaponReq.comMat[0].matList.push(insert);
                } else {
                    curComMat.reqNum += ascenReq[i].comMatNum;
                }
            }

            weaponReq.misc[0].reqNum += ascenReq[i].mora;
        }
    }

    return weaponReq;
}
console.log(getTalentReq("Amber", 1, 10, "autoAttack"))
// Returns an object of total material and mora requirements reach talent level reqLvl
function getTalentReq(name, curLvl, reqLvl, talent = null) {
    let character = searchArray(name, generalData.charList);
    let talents = character.isTraveler ? getGenCharReq(name).talentReq[talent] : generalData.talents;
    console.log(talents)
    let ele = character.isTraveler ? character.name.split(' ')[1].toLowerCase() : '';
    character.comMat = character.isTraveler ? miscData.traveler[ele][talent].comMat : character.comMat;
    character.bossMat = character.isTraveler ? miscData.traveler[ele][talent].bossMat : character.bossMat;
    let mora = getMatNameType("Mora", "misc");
    let crown = getMatNameType("Crown of Insight", "misc");

    let talentReq = {
        talentMat: [],
        comMat: [],
        bossMat: [],
        misc: [
            {
                name: mora.name,
                type: mora.type,
                reqNum: 0,
            },
            {
                name: crown.name,
                type: crown.type,
                reqNum: 0,
            }
        ]
    }

    for (let i=0; i<talents.length; i++) {
        if (curLvl < talents[i].level && reqLvl >= talents[i].level) {
            let curTalentName = character.isTraveler ? talents[i].talentMat : character.talentMat;
            let curTalentMat = searchArray(curTalentName, talentReq.talentMat);
            if (curTalentMat === null) {
                let insert = {
                    name: curTalentName,
                    matList: [],
                }
                let talentTypes = searchArray(curTalentName, generalData.materials.talentMat);
                for (let i=0; i<rarTypes.length; i++) {
                    if (talentTypes[rarTypes[i]] !== null) {
                        let mat = {
                            name: talentTypes[rarTypes[i]],
                            type: rarTypes[i],
                            reqNum: talents[i].talentMatType === rarTypes[i] ? talents[i].talentMatNum : 0,
                        }
                        insert.matList.push(mat);
                    }
                }
                talentReq.talentMat.push(insert);
            } else {
                let talentName = getMatNameType(curTalentName, "talentMat", talents[i].talentMatType).name;
                let curTalentObj = searchArray(talentName, curTalentMat.matList);
                curTalentObj.reqNum += talents[i].talentMatNum;

            }
            
            let comMat = getMatNameType(character.comMat, "comMat", talents[i].comMatType);
            if (talentReq.comMat.length === 0) {
                let insert = {
                    name: character.comMat,
                    matList: [
                        {
                            name: comMat.name,
                            type: comMat.type,
                            reqNum: talents[i].comMatNum,
                        },
                    ],
                };
                talentReq.comMat.push(insert);
            } else {
                let curComMat = searchArray(comMat.name, talentReq.comMat);
                if (curComMat === null) {
                    let insert = {
                        name: comMat.name,
                        type: comMat.type,
                        reqNum: talents[i].comMatNum,
                    };
                    talentReq.comMat[0].matList.push(insert);
                } else {
                    curComMat.reqNum += talents[i].comMatNum;
                }
            }

            if (talentReq.bossMat.length === 0) {
                let bossMat = getMatNameType(character.bossMat, "locSpec");
                let insert = {
                    name: bossMat.name,
                    type: bossMat.type,
                    reqNum: talents[i].bossMatNum,
                };
                talentReq.bossMat.push(insert);
            } else {
                talentReq.bossMat[0].reqNum += talents[i].bossMatNum;
            }

            talentReq.misc[0].reqNum += talents[i].mora;
            talentReq.misc[1].reqNum += talents[i].crownNum;
        }
    }

    return talentReq;
}

// Returns an object of total material requirements for all characters within charList
// charList must be in the format:
// [
//     {
//         name: "name",
//         curLvl: lvl,
//         reqLvl: lvl,
//     },
// ]
function getAllCharReq(charList) {
    if (charList.length === 0) return {};
    let allCharReq = {
        eleCrys: [],
        eleMat: [],
        locSpec: [],
        comMat: [],
        charExp: {
            matList: [],
            wastedExp: 0,
        },
        misc: [],
    };

    for (let i=0; i<charList.length; i++) {
        let curChar = getCharReq(charList[i].name, charList[i].curLvl, charList[i]. reqLvl);
        for (let key in allCharReq) {
            if (key !== "charExp") {
                for(let i=0; i<curChar[key].length; i++) {
                    let curMat = searchArray(curChar[key][i].name, allCharReq[key]);
                    if (curMat === null) {
                        allCharReq[key].push(curChar[key][i]);
                    } else {
                        if ("matList" in curMat) {
                            for (let j=0; j<curChar[key][i].matList.length; j++) {
                                let curMatList = searchArray(curChar[key][i].matList[j].name, curMat.matList);
                                if (curMatList === null) {
                                    curMat.matList.push(curChar[key][i].matList[j]);
                                } else {
                                    curMatList.reqNum += curChar[key][i].matList[j].reqNum;
                                }
                            }
                        } else {
                            curMat.reqNum += curChar[key][i].reqNum;
                        }
                    }
                }
            } else {
                if (allCharReq.charExp.matList.length === 0) {
                    allCharReq.charExp = curChar.charExp;
                } else {
                    for (let i=0; i<curChar.charExp.matList.length; i++) {
                        allCharReq.charExp.matList[i].reqNum += curChar.charExp.matList[i].reqNum;
                    }
                    allCharReq.charExp.wastedExp += curChar.charExp.wastedExp;
                }
            }
        }
    }

    return allCharReq;
}

// Returns an object of total material requirements for all weapons within weaponList
// weaponList must be in the format:
// [
//     {
//         name: "name",
//         number: number,
//         curLvl: lvl,
//         reqLvl: lvl,
//     },
// ]
function getAllWeaponReq(weaponList) {
    if (weaponList.length === 0) return {};
    let allWeaponReq = {
        weaponMat: [],
        eliteMat: [],
        comMat: [],
        weaponExp: {
            matList: [],
            wastedExp: 0,
        },
        misc: [],
    };

    for (let i=0; i<weaponList.length; i++) {
        let curWeapon = getWeaponReq(weaponList[i].name, weaponList[i].curLvl, weaponList[i].reqLvl, weaponList[i].number);
        for (let key in allWeaponReq) {
            if (key !== "weaponExp") {
                for(let i=0; i<curWeapon[key].length; i++) {
                    let curMat = searchArray(curWeapon[key][i].name, allWeaponReq[key]);
                    if (curMat === null) {
                        allWeaponReq[key].push(curWeapon[key][i]);
                    } else {
                        for (let j=0; j<curWeapon[key][i].matList.length; j++) {
                            let curMatList = searchArray(curWeapon[key][i].matList[j].name, curMat.matList);
                            if (curMatList === null) {
                                curMat.matList.push(curWeapon[key][i].matList[j]);
                            } else {
                                curMatList.reqNum += curWeapon[key][i].matList[j].reqNum;
                            }
                        }
                    }
                }
            } else {
                if (allWeaponReq.weaponExp.matList.length === 0) {
                    allWeaponReq.weaponExp = curWeapon.weaponExp;
                } else {
                    for (let i=0; i<curWeapon.weaponExp.matList.length; i++) {
                        allWeaponReq.weaponExp.matList[i].reqNum += curWeapon.weaponExp.matList[i].reqNum;
                    }
                    allWeaponReq.weaponExp.wastedExp += curWeapon.weaponExp.wastedExp;
                }
            }
        }
    }

    return allWeaponReq;
}

// Returns an object of total talent and mora requirements for all talents for all characters in charList
// charList must be in the format:
// [
//     {
//         name: "Name",
//         autoAttack: {
//             curLvl: lvl,
//             reqLvl: lvl,
//         },
//         eleSkill: {
//             curLvl: lvl,
//             reqLvl: lvl,
//         },
//         eleBurst: {
//             curLvl: lvl,
//             reqLvl: lvl,
//         },
//     },
// ]

function getAllTalentReq(charList) {
    if (charList.length === 0) return {};
    let allTalentReq = {
        talentMat: [],
        comMat: [],
        bossMat: [],
        misc: [],
    };

    for (let i=0; i<charList.length; i++) {
        for (let talent in charList[i]) {
            if (talent === "autoAttack" || talent === "eleSkill" || talent === "eleBurst") {
                let curTalent = getTalentReq(charList[i].name, charList[i][talent].curLvl, charList[i][talent].reqLvl, talent);
                for (let key in allTalentReq) {
                    for(let i=0; i<curTalent[key].length; i++) {
                        let curMat = searchArray(curTalent[key][i].name, allTalentReq[key]);
                        if (curMat === null) {
                            allTalentReq[key].push(curTalent[key][i]);
                        } else {
                            if ("matList" in curMat) {
                                for (let j=0; j<curTalent[key][i].matList.length; j++) {
                                    let curMatList = searchArray(curTalent[key][i].matList[j].name, curMat.matList);
                                    if (curMatList === null) {
                                        curMat.matList.push(curTalent[key][i].matList[j]);
                                    } else {
                                        curMatList.reqNum += curTalent[key][i].matList[j].reqNum;
                                    }
                                }
                            } else {
                                curMat.reqNum += curTalent[key][i].reqNum;
                            }
                        }
                    }
                }
            }
        }
    }

    return allTalentReq;
}

module.exports = {
    generalData,
    searchArray,
    getMatNameType,
    getGenCharReq,
    getCharReq,
    getWeaponReq,
    getTalentReq,
    getAllCharReq,
    getAllWeaponReq,
    getAllTalentReq,
}