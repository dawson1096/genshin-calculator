const fs = require("fs");
const path = require("path");
const { search } = require("../routes/user-route");

let data = fs.readFileSync(path.resolve(__dirname, '../assets/general.json'));
let generalData = JSON.parse(data);
let miscData = generalData.miscData;

function searchArray(searchKey, array) {
    for (let i =0; i<array.length; i++) {
        let key = "name" in array[i] ? array[i].name : "level" in array[i] ? array[i].level : array[i].stars;
        if (searchKey === key) {
            return array[i];
        }
    }
    console.log("ERROR: Item not found");
    return null;
}

function getFullMatName(name, matType, type) {
    let match = searchArray(name, generalData.materials[matType]);
    if (match !== null) {
        if (match[type] !== null){
            return match[type];
        } else {
            console.log(`ERROR: Type doesn't exist on ${name}`);
            return null;
        }
    }

    console.log("ERROR: Name not found");
    return null;
}

function getCharReq(name) {
    let char = searchArray(name, generalData.charList);
    let charReq = {
        name: null,
        stars: null,
        ascenReq: null,
        talentReq: null,
    };

    charReq["name"] = char.name;
    charReq["stars"] = char.stars;
    charReq["ascenReq"] = [];
    charReq["talentReq"] = [];

    let levels = miscData.charAscenLevels;

    for (let i=0; i<levels.length; i++) {
        let ascenLevelReq = searchArray(levels[i], generalData.charAscension);
        let calcReq = {
            level: null,
            eleCrys: null,
            eleCrysNum: null,
            eleMat: null,
            eleMatNum: null,
            locSpec: null,
            locSpecNum: null,
            comMat: null,
            comMatNum:null,
            mora: null
        };

        calcReq["level"] = levels[i];
        calcReq["eleCrys"] = getFullMatName(char.eleCrys,"eleCrys", ascenLevelReq.eleCrysType);
        calcReq["eleCrysNum"] = ascenLevelReq.eleCrysNum;
        calcReq["eleMat"] = char.eleMat;
        calcReq["eleMatNum"] = ascenLevelReq.eleMatNum;
        calcReq["locSpec"] = char.locSpec;
        calcReq["locSpecNum"] = ascenLevelReq.locSpecNum;
        calcReq["comMat"] = getFullMatName(char.comMat,"comMat", ascenLevelReq.comMatType);
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
            talentMatNum: null,
            comMat: null,
            comMatNum: null,
            bossMat: null,
            bossMatNum: null,
            crownNum: null,
            mora: null,
        }

        calcReq["level"] = talentLevels[i];
        calcReq["talentMat"] = getFullMatName(char.talBook, "talentBook", talentReq.bookType);
        calcReq["talentMatNum"] = talentReq.bookNum;
        calcReq["comMat"] = getFullMatName(char.comMat, "comMat", talentReq.comMatType);
        calcReq["comMatNum"] = talentReq.comMatNum;
        calcReq["bossMat"] = char.bossMat;
        calcReq["bossMatNum"] = talentReq.bossNum;
        calcReq["crownNum"] = talentReq.crownNum;
        calcReq["mora"] = talentReq.mora;

        charReq["talentReq"].push(calcReq)
    }

    return charReq;
}

function getWeaponReq(name) {
    let weapon = searchArray(name, generalData.weaponList);
    let weaponReq = {
        name: null,
        stars: null,
        type: null,
        ascenReq: null,
    };

    weaponReq["name"] = weapon.name;
    weaponReq["stars"] = weapon.stars;
    weaponReq["type"] = weapon.type;
    weaponReq["ascenReq"] = [];

    let starAscenArray = searchArray(weapon.stars, generalData.weaponAscension).weaponStarAscen;
    let levels = searchArray(weapon.stars, miscData.weaponStars).weaponAscenLevels;

    for(let i=0; i<levels.length; i++) {
        let ascenLevelReq = searchArray(levels[i], starAscenArray);
        let calcReq = {
            level: null,
            weaponMat: null,
            weaponMatNum: null,
            comMat1: null,
            comMat1Num:null,
            comMat2: null,
            comMat2Num:null,
            mora: null
        };

        calcReq["level"] = levels[i];
        calcReq["weaponMat"] = getFullMatName(weapon.weaponMat, "weaponMat", ascenLevelReq.weaponMatType);
        calcReq["weaponMatNum"] = ascenLevelReq.weaponMatNum;
        calcReq["comMat1"] = getFullMatName(weapon.comMat1, "comMat", ascenLevelReq.comMat1Type);
        calcReq["comMat1Num"] = ascenLevelReq.comMat1Num;
        calcReq["comMat2"] = getFullMatName(weapon.comMat2, "comMat", ascenLevelReq.comMat2Type);
        calcReq["comMat2Num"] = ascenLevelReq.comMat2Num;
        calcReq["mora"] = ascenLevelReq.mora;

        weaponReq["ascenReq"].push(calcReq);
    }

    return weaponReq;
}

function calcCharExp(curLvl, reqLvl) {
    if (curLvl > reqLvl) {
        console.log("ERROR: Required level must be greater than current level");
        return null;
    }

    let levelOne = {
        level: 1,
        cumulMora: 0,
        cumulExp: 0,
    };

    let curLvlStats = curLvl === 1 ? levelOne : searchArray(curLvl, generalData.charLevel);
    let reqLvlStats = searchArray(reqLvl, generalData.charLevel);
    let expReq = {
        mora: null,
        exp: null,
    }

    expReq["mora"] = reqLvlStats.cumulMora - curLvlStats.cumulMora;
    expReq["exp"] = reqLvlStats.cumulExp - curLvlStats.cumulExp;

    return expReq;
}

function calcWeaponExp(stars, curLvl, reqLevel) {
    if (stars < 1 || stars > 5) {
        console.log("ERROR: Invalid star number");
        return null;
    } else if (curLvl > reqLvl) {
        console.log("ERROR: Required level must be greater than current level");
        return null;
    }

    let levels = searchArray(stars, generalData.weaponLevel).weaponStarLevel;
    let levelOne = {
        level: 1,
        cumulMora: 0,
        cumulExp: 0,
    };

    let curLvlStats = curLvl === 1 ? levelOne : searchArray(curLvl, levels);
    let reqLvlStats = searchArray(reqLvl, levels);
    let expReq = {
        mora: null,
        exp: null,
    }

    expReq["mora"] = reqLvlStats.cumulMora - curLvlStats.cumulMora;
    expReq["exp"] = reqLvlStats.cumulExp - curLvlStats.cumulExp;

    return expReq;
}

function calcReqExpMat(exp, mat1Num, mat2Num, mat3Num, type) {
    if (type === "weapon") {
        let mat = generalData.materials.weaponMat;
        let curExp = 0;

        let array = [];
        let mat3 = searchArray("Mystic Enhancement Ore", mat);
        array.push(mat3);
        let mat2 = searchArray("Fine Enhancement Ore", mat);``
        array.push(mat2);
        let mat1 = searchArray("Enhancement Ore", mat);
        array.push(mat1);
        
        let expReq = {
            mat1: {
                name: "Enhancement Ore",
                reqNum: 0,
            },
            mat2: {
                name: "Fine Enhancement Ore",
                reqNum: 0,
            },
            mat3: {
                name: "Mystic Enhancement Ore",
                reqNum: 0,
            },
            wastedExp: 0,
        }

        curExp = (mat1.exp * mat1num) + (mat2.exp * mat2num) + (mat3.exp * mat3num);
        reqExp = exp - curExp;

        for (let i=0; i<3; i++) {
            let curMat = array[i];
            if (reqExp < curMat.exp) {
                continue;
            }
            let reqNum = Math.floor(reqExp / curMat.exp);
            expReq[`mat${3-i}`]["reqNum"] = reqNum;

            reqExp = reqExp - (reqNum * curMat.exp);
        }

    } else if (type === "char") {

    }

    console.log("ERROR: Invalid type")
    return null;
}

calcReqWeapExpMat

module.exports = {
    generalData,
}