const fs = require("fs");
const path = require("path");

let data = fs.readFileSync(path.resolve(__dirname, '../assets/general.json'));
let generalData = JSON.parse(data);
let miscData = generalData.miscData;

// Searches for searchKey which can be 'name', 'level' or 'stars' in given array of objects
function searchArray(searchKey, array) {
    let key = "name" in array[0] ? "name" : "level" in array[0] ? "level" : "stars";

    for (let i =0; i<array.length; i++) {
        let value = array[i][key]

        if (searchKey === value) {
            return array[i];
        }
    }
    console.log("ERROR: Item not found");
    return null;
}

// Returns the full material name and type given the short name, material type, and rarity type (optional)
function getMatNameType(name, matType, type = null) {
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
            console.log(`ERROR: Type ${type} doesn't exist on ${name}`);
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
        calcReq["eleMat"] = eleMat.name;
        calcReq["eleMatType"] = eleMat.type;
        calcReq["eleMatNum"] = ascenLevelReq.eleMatNum;
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
        let talentMat = getMatNameType(char.talentMat, "talentMat", talentReq.talentMatType);
        calcReq["talentMat"] = talentMat.name;
        calcReq["talentMatType"] = talentMat.type;
        calcReq["talentMatNum"] = talentReq.talentMatNum;
        let comMat = getMatNameType(char.comMat, "comMat", talentReq.comMatType);
        calcReq["comMat"] = comMat.name;
        calcReq["comMatType"] = comMat.type;
        calcReq["comMatNum"] = talentReq.comMatNum;
        let bossMat = getMatNameType(char.bossMat, "bossMat");
        calcReq["bossMat"] = bossMat.name;
        calcReq["bossMatType"] = bossMat.type;
        calcReq["bossMatNum"] = talentReq.bossNum;
        calcReq["crownNum"] = talentReq.crownNum;
        calcReq["mora"] = talentReq.mora;

        charReq["talentReq"].push(calcReq)
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
function calcExpMatReq(exp, expMat) {
    let matReq = {
        mat: [],
        wastedExp: 0,
    };

    for (let i=0; i<expMat.length; i++) {
        let curReq = {
            name: expMat[i].name,
            reqNum: 0,
        };
        if (exp > expMat[i].exp) {
            let matNum;
            if (i === expMat.length - 1) {
                matNum = Math.ceil(exp / expMat[i].exp);
            } else {
                matNum = Math.floor(exp / expMat[i].exp);
            }
            curReq["reqNum"] = matNum;
            exp = exp - (matNum * expMat[i].exp);
        }
        matReq["mat"].push(curReq);
    }

    if (exp > 0) {
        matReq["mat"][expMat.length - 1]["reqNum"] += 1;
        exp = exp - expMat[expMat.length - 1].exp;
    }

    matReq["wastedExp"] = Math.abs(exp);

    return matReq;
}

// This will return and object of the weapon exp materials required to reach reqLvl from curLvl and the mora required including ascension costs
function getWeaponExpMatReq(stars, curLvl, reqLvl) {
    if (stars < 1 || stars > 5) {
        console.log("ERROR: Invalid star number");
        return null;
    } else if (curLvl > reqLvl) {
        console.log("ERROR: Required level must be greater than current level");
        return null;
    }

    let levels = searchArray(stars, generalData.weaponLevel).weaponStarLevel;

    if (curLvl < 1 || reqLvl > levels[levels.length-1].level) {
        console.log(`ERROR: Levels must be within the range 1 and ${levels[levels.length-1].level}`);
        return null;
    }

    let curLvlStats = searchArray(curLvl, levels);
    let reqLvlStats = searchArray(reqLvl, levels);
    let weaponExpReq = {
        mat: [
            {
                name: "Mystic Enhancement Ore",
                type: "blue",
                reqNum: 0,
            },
            {
                name: "Fine Enhancement Ore",
                type: "green",
                reqNum: 0,
            },
            {
                name: "Enhancement Ore",
                type: "white",
                reqNum: 0,
            }
        ],
        wastedExp: 0,
        mora: 0,
    };

    weaponExpReq["mora"] = reqLvlStats.cumulMora - curLvlStats.cumulMora;

    let ascenLevels = searchArray(stars, miscData.weaponStars).weaponAscenLevels;
    let ascenReq = searchArray(stars, generalData.weaponAscension).weaponStarAscen;
    let weaponExpMat = generalData.materials.weaponExp;

    for (let i=0; i<ascenLevels.length; i++) {
        if (curLvlStats.level < ascenLevels[i] && reqLvl > ascenLevels[i]) {
            let ascenMora = searchArray(ascenLevels[i], ascenReq).mora;
            weaponExpReq["mora"] += ascenMora;
            let curReqStats = searchArray(ascenLevels[i], levels);
            let expReq = curReqStats.cumulExp - curLvlStats.cumulExp;
            let curMatReq = calcExpMatReq(expReq, weaponExpMat);
            weaponExpReq["wastedExp"] += curMatReq.wastedExp;
            for (let i=0; i<curMatReq.mat.length; i++) {
                weaponExpReq["mat"][i]["reqNum"] += curMatReq["mat"][i]["reqNum"];
            }
            curLvlStats = curReqStats;
        }
    }

    let remExpReq = reqLvlStats.cumulExp - curLvlStats.cumulExp;
    let curMatReq = calcExpMatReq(remExpReq, weaponExpMat);
    weaponExpReq["wastedExp"] += curMatReq.wastedExp;
    for (let i=0; i<curMatReq.mat.length; i++) {
        weaponExpReq["mat"][i]["reqNum"] += curMatReq["mat"][i]["reqNum"];
    }

    return weaponExpReq;
}

// This will return and object of the character exp materials required to reach reqLvl from curLvl and the mora required including ascension costs
function getCharExpMatReq(curLvl, reqLvl) {
    if (curLvl > reqLvl) {
        console.log("ERROR: Required level must be greater than current level");
        return null;
    } else if (curLvl < 1 || reqLvl > 90) {
        console.log(`ERROR: Levels must be within the range 1 and 90`);
        return null;
    }

    let levels = generalData.charLevel;
    let curLvlStats = searchArray(curLvl, levels);
    let reqLvlStats = searchArray(reqLvl, levels);
    let charExpReq = {
        mat: [
            {
                name: "Hero's Wit",
                type: "purple",
                reqNum: 0,
            },
            {
                name: "Adventurer's Experience",
                type: "blue",
                reqNum: 0,
            },
            {
                name: "Wanderer's Advice",
                type: "green",
                reqNum: 0,
            }
        ],
        wastedExp: 0,
        mora: 0,
    };

    charExpReq["mora"] = reqLvlStats.cumulMora - curLvlStats.cumulMora;

    let ascenLevels = miscData.charAscenLevels;
    let ascenReq = generalData.charAscension;
    let charExpMat = generalData.materials.charExp;

    for (let i=0; i<ascenLevels.length; i++) {
        if (curLvlStats.level < ascenLevels[i] && reqLvl > ascenLevels[i]) {
            let ascenMora = searchArray(ascenLevels[i], ascenReq).mora;
            charExpReq["mora"] += ascenMora;
            let curReqStats = searchArray(ascenLevels[i], levels);
            let expReq = curReqStats.cumulExp - curLvlStats.cumulExp;
            let curMatReq = calcExpMatReq(expReq, charExpMat);
            charExpReq["wastedExp"] += curMatReq.wastedExp;
            for (let i=0; i<curMatReq.mat.length; i++) {
                charExpReq["mat"][i]["reqNum"] += curMatReq["mat"][i]["reqNum"];
            }
            curLvlStats = curReqStats;
        }
    }

    let remExpReq = reqLvlStats.cumulExp - curLvlStats.cumulExp;
    let curMatReq = calcExpMatReq(remExpReq, charExpMat);
    charExpReq["wastedExp"] += curMatReq.wastedExp;

    for (let i=0; i<curMatReq.mat.length; i++) {
        charExpReq["mat"][i]["reqNum"] += curMatReq["mat"][i]["reqNum"];
    }

    return charExpReq;
}

// Returns an object of total material requirements to reach character level reqLvl
function getCharReq(name, curLvl, reqLvl) {
    if (curLvl > reqLvl) {
        console.log("ERROR: Required level must be greater than current level");
        return null;
    } else if (curLvl < 1 || reqLvl > 90) {
        console.log(`ERROR: Levels must be within the range 1 and 90`);
        return null;
    }

    let genCharReq = getGenCharReq(name);
    let expMat = getCharExpMatReq(curLvl, reqLvl);
    let charReq = {
        name: genCharReq.name,
        stars: genCharReq.stars,
        eleCrys: [],
        eleMat: genCharReq.ascenReq[0].eleMat,
        eleMatType: genCharReq.ascenReq[0].eleMatType,
        eleMatNum: 0,
        locSpec: genCharReq.ascenReq[0].locSpec,
        locSpecType: genCharReq.ascenReq[0].locSpecType,
        locSpecNum: 0,
        comMat: [],
        exp: {
            mat: expMat.mat,
            wastedExp: expMat.wastedExp,
        },
        mora: expMat.mora,
    };

    let rarTypes = miscData.rarType;
    let character = searchArray(name, generalData.charList);
    let eleCrys = searchArray(character.eleCrys, generalData.materials.eleCrys);
    let comMat = searchArray(character.comMat, generalData.materials.comMat);

    for (let i=0; i<rarTypes.length; i++) {
        if (eleCrys[rarTypes[i]] !== null) {
            let mat = {
                name: eleCrys[rarTypes[i]],
                type: rarTypes[i],
                reqNum: 0,
            }
            charReq.eleCrys.push(mat);
        }

        if (comMat[rarTypes[i]] !== null) {
            let mat = {
                name: comMat[rarTypes[i]],
                type: rarTypes[i],
                reqNum: 0,
            }
            charReq.comMat.push(mat);
        }
    }

    let eleCrysCount = 0;
    let comMatCount = 0;

    for (let i=0; i<genCharReq.ascenReq.length; i++) {
        if (curLvl < genCharReq.ascenReq[i].level && reqLvl > genCharReq.ascenReq[i].level) {
            let curEleCrysType = genCharReq.ascenReq[i].eleCrysType;
            let curComMatType = genCharReq.ascenReq[i].comMatType;

            while (curEleCrysType !== charReq.eleCrys[eleCrysCount].type && eleCrysCount < charReq.eleCrys.length) {
                eleCrysCount ++;
            }

            while (curComMatType !== charReq.comMat[comMatCount].type && comMatCount < charReq.comMat.length) {
                comMatCount ++;
            }

            charReq.eleCrys[eleCrysCount]["reqNum"] += genCharReq.ascenReq[i].eleCrysNum;
            charReq["eleMatNum"] += genCharReq.ascenReq[i].eleMatNum;
            charReq["locSpecNum"] += genCharReq.ascenReq[i].locSpecNum;
            charReq["comMat"][comMatCount]["reqNum"] += genCharReq.ascenReq[i].comMatNum;
        }
    }

    return charReq;
}

// Returns an object of total material requirements to reach weapon level reqLvl
function getWeaponReq(name, curLvl, reqLvl) {
    if (curLvl > reqLvl) {
        console.log("ERROR: Required level must be greater than current level");
        return null;
    } else if (curLvl < 1 || reqLvl > 90) {
        console.log(`ERROR: Levels must be within the range 1 and 90`);
        return null;
    }

    let genWeaponReq = getGenWeaponReq(name);
    let expMat = getWeaponExpMatReq(genWeaponReq.stars, curLvl, reqLvl);
    let weaponReq = {
        name: genWeaponReq.name,
        stars: genWeaponReq.stars,
        type: genWeaponReq.type,
        weaponMat: [],
        eliteMat: [],
        comMat: [],
        exp: {
            mat: expMat.mat,
            wastedExp: expMat.wastedExp,
        },
        mora: expMat.mora,
    };

    let rarTypes = miscData.rarType;
    let weapon = searchArray(name, generalData.weaponList);
    let weaponMat = searchArray(weapon.weaponMat, generalData.materials.weaponMat);
    let eliteMat = searchArray(weapon.eliteMat, generalData.materials.eliteMat);
    let comMat = searchArray(weapon.comMat, generalData.materials.comMat);

    for (let i=0; i<rarTypes.length; i++) {
        if (weaponMat[rarTypes[i]] !== null) {
            let mat = {
                name: weaponMat[rarTypes[i]],
                type: rarTypes[i],
                reqNum: 0,
            }
            weaponReq.weaponMat.push(mat);
        }

        if (eliteMat[rarTypes[i]] !== null) {
            let mat = {
                name: eliteMat[rarTypes[i]],
                type: rarTypes[i],
                reqNum: 0,
            }
            weaponReq.eliteMat.push(mat);
        }

        if (comMat[rarTypes[i]] !== null) {
            let mat = {
                name: comMat[rarTypes[i]],
                type: rarTypes[i],
                reqNum: 0,
            }
            weaponReq.comMat.push(mat);
        }
    }

    let weaponMatCount = 0;
    let eliteMatCount = 0;
    let comMatCount = 0;

    for (let i=0; i<genWeaponReq.ascenReq.length; i++) {
        if (curLvl < genWeaponReq.ascenReq[i].level && reqLvl > genWeaponReq.ascenReq[i].level) {
            let curWeaponMatType = genWeaponReq.ascenReq[i].weaponMatType;
            let cureliteMatType = genWeaponReq.ascenReq[i].eliteMatType;
            let curComMatType = genWeaponReq.ascenReq[i].comMatType;

            while (curWeaponMatType !== weaponReq.weaponMat[weaponMatCount].type && weaponMatCount < weaponReq.weaponMat.length) {
                weaponMatCount ++;
            }

            while (cureliteMatType !== weaponReq.eliteMat[eliteMatCount].type && eliteMatCount < weaponReq.eliteMat.length) {
                eliteMatCount ++;
            }

            while (curComMatType !== weaponReq.comMat[comMatCount].type && comMatCount < weaponReq.comMat.length) {
                comMatCount ++;
            }

            weaponReq.weaponMat[weaponMatCount].reqNum += genWeaponReq.ascenReq[i].weaponMatNum;
            weaponReq.eliteMat[eliteMatCount]["reqNum"] += genWeaponReq.ascenReq[i].eliteMatNum;
            weaponReq.comMat[comMatCount].reqNum += genWeaponReq.ascenReq[i].comMatNum;
        }
    }

    return weaponReq;
}

// Returns an object of total material and mora requirements reach talent level reqLvl
function getTalentReq(name, curLvl, reqLvl) {
    if (curLvl > reqLvl) {
        console.log("ERROR: Required level must be greater than current level");
        return null;
    } else if (curLvl < 1 || reqLvl > 90) {
        console.log(`ERROR: Levels must be within the range 1 and 10`);
        return null;
    }

    let character = searchArray(name, generalData.charList);
    let talents = generalData.talents;
    let talentReq = {
        talentMat: [],
        comMat: [],
        bosstMat: character.bossMat,
        bossMatType: getMatNameType(character.bossMat, "bossMat").type,
        bossMatNum: 0,
        // Crown name will be hardcoded in front end for now
        crownNum: 0,
        mora: 0,
    }

    let rarTypes = miscData.rarType;
    let talentMat = searchArray(character.talentMat, generalData.materials.talentMat);
    let comMat = searchArray(character.comMat, generalData.materials.comMat);

    for (let i=0; i<rarTypes.length; i++) {
        if (talentMat[rarTypes[i]] !== null) {
            let mat = {
                name: talentMat[rarTypes[i]],
                type: rarTypes[i],
                reqNum: 0,
            }
            talentReq.talentMat.push(mat);
        }

        if (comMat[rarTypes[i]] !== null) {
            let mat = {
                name: comMat[rarTypes[i]],
                type: rarTypes[i],
                reqNum: 0,
            }
            talentReq.comMat.push(mat);
        }
    }

    let talentMatCount = 0;
    let comMatCount = 0;

    for (let i=0; i<talents.length; i++) {
        if (curLvl < talents[i].level && reqLvl >= talents[i].level) {
            let curTalentMatType = talents[i].talentMatType;
            let curComMatType = talents[i].comMatType;

            while (curTalentMatType !== talentReq.talentMat[talentMatCount].type && talentMatCount < talentReq.talentMat.length) {
                talentMatCount ++;
            }

            while (curComMatType !== talentReq.comMat[comMatCount].type && comMatCount < talentReq.comMat.length) {
                comMatCount ++;
            }

            talentReq.talentMat[talentMatCount].reqNum += talents[i].talentMatNum;
            talentReq.comMat[comMatCount]["reqNum"] += talents[i].comMatNum;
            talentReq.bossMatNum += talents[i].bossNum;
            talentReq.crownNum += talents[i].crownNum;
            talentReq.mora += talents[i].mora;
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
    let allCharReq = {
        eleCrys: [],
        eleMat: [],
        locSpec: [],
        comMat: [],
        exp: {
            mat: [],
            wastedExp: 0,
        },
        mora: 0,
    }

    let multiMat = miscData.matType.multiType;
    let singleMat = miscData.matType.singleType;
    let rarTypes = miscData.rarType;

    for (let i=0; i<multiMat.length; i++) {
        if (multiMat[i] in allCharReq) {
            let shortNames = miscData.shortNames[multiMat[i]];
            for (let j=0; j<shortNames.length; j++) {
                let matCat = {
                    name: shortNames[j],
                    matList: [],
                }
                for (let k=0; k<rarTypes.length; k++) {
                    let mat = getMatNameType(shortNames[j], multiMat[i], rarTypes[k]);
                    if (mat !== null) {
                        let insertMat = {
                            name: mat.name,
                            type: mat.type,
                            reqNum: 0,
                        }
                        matCat.matList.push(insertMat);
                    }
                }
                allCharReq[multiMat[i]].push(matCat);
            }
        }
    }

    for (let i=0; i<singleMat.length; i++) {
        if (singleMat[i] in allCharReq) {
            let names = generalData.materials[singleMat[i]];
            
            for (let j=0; j<names.length; j++) {
                let mat = {
                    name: names[j].name,
                    type: names[j].type,
                    reqNum: 0,
                }

                allCharReq[singleMat[i]].push(mat);
            }
        }
    }

    let expMat = generalData.materials.charExp;

    for (let i=0; i<expMat.length; i++) {
        let mat = {
            name: expMat[i].name,
            type: expMat[i].type,
            reqNum: 0,
        }

        allCharReq.exp.mat.push(mat);
    }

    for (let i=0; i<charList.length; i++) {
        let curChar = getCharReq(charList[i].name, charList[i].curLvl, charList[i]. reqLvl);
        let character = searchArray(charList[i].name, generalData.charList);

        let eleCrys = searchArray(character.eleCrys, allCharReq.eleCrys);
        for (let j=0; j<eleCrys.matList.length; j++) {
            eleCrys.matList[j].reqNum += curChar.eleCrys[j].reqNum;
        }

        let eleMat = searchArray(character.eleMat, allCharReq.eleMat);
        eleMat.reqNum += curChar.eleMatNum;
        
        let locSpec = searchArray(character.locSpec, allCharReq.locSpec);
        locSpec.reqNum += curChar.locSpecNum;

        let comMat = searchArray(character.comMat, allCharReq.comMat);
        for (let j=0; j<comMat.matList.length; j++) {
            comMat.matList[j].reqNum += curChar.comMat[j].reqNum;
        }

        for (let j=0; j<allCharReq.exp.mat.length; j++) {
            allCharReq.exp.mat[j].reqNum += curChar.exp.mat[j].reqNum;
        }

        allCharReq.exp.wastedExp += curChar.exp.wastedExp;
        allCharReq.mora += curChar.mora;
    }

    return allCharReq;
}

// Returns an object of total material requirements for all weapons within weaponList
// weaponList must be in the format:
// [
//     {
//         name: "name",
//         curLvl: lvl,
//         reqLvl: lvl,
//     },
// ]
function getAllWeaponReq(weaponList) {
    let allWeaponReq = {
        weaponMat: [],
        eliteMat: [],
        comMat: [],
        exp: {
            mat: [],
            wastedExp: 0,
        },
        mora: 0,
    }

    let multiMat = miscData.matType.multiType;
    let rarTypes = miscData.rarType;

    for (let i=0; i<multiMat.length; i++) {
        if (multiMat[i] in allWeaponReq) {
            let shortNames = miscData.shortNames[multiMat[i]];
            for (let j=0; j<shortNames.length; j++) {
                let matCat = {
                    name: shortNames[j],
                    matList: [],
                }
                for (let k=0; k<rarTypes.length; k++) {
                    let mat = getMatNameType(shortNames[j], multiMat[i], rarTypes[k]);
                    if (mat !== null) {
                        let insertMat = {
                            name: mat.name,
                            type: mat.type,
                            reqNum: 0,
                        }
                        matCat.matList.push(insertMat);
                    }
                }
                allWeaponReq[multiMat[i]].push(matCat);
            }
        }
    }

    let expMat = generalData.materials.weaponExp;

    for (let i=0; i<expMat.length; i++) {
        let mat = {
            name: expMat[i].name,
            type: expMat[i].type,
            reqNum: 0,
        }

        allWeaponReq.exp.mat.push(mat);
    }

    for (let i=0; i<weaponList.length; i++) {
        let curWeapon = getWeaponReq(weaponList[i].name, weaponList[i].curLvl, weaponList[i].reqLvl);
        let weapon = searchArray(weaponList[i].name, generalData.weaponList);

        let weaponMat = searchArray(weapon.weaponMat, allWeaponReq.weaponMat);
        for (let j=0; j<weaponMat.matList.length; j++) {
            weaponMat.matList[j].reqNum += curWeapon.weaponMat[j].reqNum;
        }

        let eliteMat = searchArray(weapon.eliteMat, allWeaponReq.eliteMat);
        for (let j=0; j<eliteMat.matList.length; j++) {
            eliteMat.matList[j].reqNum += curWeapon.eliteMat[j].reqNum;
        }
        
        let comMat = searchArray(weapon.comMat, allWeaponReq.comMat);
        for (let j=0; j<comMat.matList.length; j++) {
            comMat.matList[j].reqNum += curWeapon.comMat[j].reqNum;
        }

        for (let j=0; j<allWeaponReq.exp.mat.length; j++) {
            allWeaponReq.exp.mat[j].reqNum += curWeapon.exp.mat[j].reqNum;
        }

        allWeaponReq.exp.wastedExp += curWeapon.exp.wastedExp;
        allWeaponReq.mora += curWeapon.mora;
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
//         eleBust: {
//             curLvl: lvl,
//             reqLvl: lvl,
//         },
//     },
// ]
function getAllTalentReq(charList) {
    let allTalentReq = {
        talentMat: [],
        comMat: [],
        bossMat: [],
        // Crown name will be hardcoded in front end for now
        crownNum: 0,
        mora: 0,
    }
    
    let multiMat = miscData.matType.multiType;
    let singleMat = miscData.matType.singleType;
    let rarTypes = miscData.rarType;

    for (let i=0; i<multiMat.length; i++) {
        if (multiMat[i] in allTalentReq) {
            let shortNames = miscData.shortNames[multiMat[i]];
            for (let j=0; j<shortNames.length; j++) {
                let matCat = {
                    name: shortNames[j],
                    matList: [],
                }
                for (let k=0; k<rarTypes.length; k++) {
                    let mat = getMatNameType(shortNames[j], multiMat[i], rarTypes[k]);
                    if (mat !== null) {
                        let insertMat = {
                            name: mat.name,
                            type: mat.type,
                            reqNum: 0,
                        }
                        matCat.matList.push(insertMat);
                    }
                }
                allTalentReq[multiMat[i]].push(matCat);
            }
        }
    }

    let names = generalData.materials["bossMat"];
    
    for (let j=0; j<names.length; j++) {
        let mat = {
            name: names[j].name,
            type: names[j].type,
            reqNum: 0,
        }

        allTalentReq["bossMat"].push(mat);
    }

    for (let i=0; i<charList.length; i++) {
        let character = searchArray(charList[i].name, generalData.charList);

        for (let talent in charList[i]) {
            if (talent === "auttoAttack" || talent === "eleSkill" || talent === "eleBurst") {
                let curTalent = getTalentReq(charList[i].name, charList[i][talent].curLvl, charList[i][talent].reqLvl);

                let talentMat = searchArray(character.talentMat, allTalentReq.talentMat);
                for (let j=0; j<talentMat.matList.length; j++) {
                    talentMat.matList[j].reqNum += curTalent.talentMat[j].reqNum;
                }
                
                let comMat = searchArray(character.comMat, allTalentReq.comMat);
                for (let j=0; j<comMat.matList.length; j++) {
                    comMat.matList[j].reqNum += curTalent.comMat[j].reqNum;
                }

                let bossMat = searchArray(character.bossMat, allTalentReq.bossMat);
                bossMat.reqNum += curTalent.bossMatNum;

                allTalentReq.mora += curTalent.mora;
                allTalentReq.crownNum += curTalent.crownNum;
            }
        }
    }


    return allTalentReq
}

module.exports = {
    generalData,
    searchArray,
    getMatNameType,
    getGenCharReq,
    getGenWeaponReq,
    getCharReq,
    getWeaponReq,
    getTalentReq,
    getAllCharReq,
    getAllWeaponReq,
    getAllTalentReq,
}