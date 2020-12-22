const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Character = new Schema({
    name: { type: String, required: true },
    stars: { type: Number, required: true },
    eleCrys: { type: String, required: true },
    eleMat: { type: String, required: true },
    locSpec: { type: String, required: true },
    comMat: { type: String, required: true },
    talBook: { type: String, required: true },
    bossMat: { type: String, required: true },
    autoAttack: { type: String, required: true },
    eleSkill: { type: String, required: true },
    eleBurst: { type: String, required: true },
});

const CharAscension = new Schema({
    level: { type: Number, required: true },
    eleCrysType: { type: String, required: true },
    eleCrysNum: { type: Number, required: true },
    eleMatNum: { type: Number, required: true },
    locSpecNum: { type: Number, required: true },
    comMatType: { type: String, required: true },
    comMatNum: { type: Number, required: true },
    mora: { type: Number, required: true },
});

const CharLevel = new Schema({
    level: { type: Number, required: true },
    cumulMora: { type: Number, required: true },
    cumulExp: { type: Number, required: true },
});

const Talent = new Schema({
    level: { type: Number, required: true },
    talentMatType: { type: String, required: true },
    talentMatNum: {type: Number, required: true },
    comMatType: { type: String, required: true },
    comMatNum: { type: Number, required: true },
    bossNum: { type: Number, required: true },
    crownNum: { type: Number, required: true},
    mora: { type: Number, required: true },
});

const Weapon = new Schema({
    name: { type: String, required: true },
    stars: { type: Number, required: true },
    weaponMat: { type: String, required: true },
    comMat: { type: String, required: true },
    eliteMat: { type: String, required: true },
});

const WeaponStarAscen = new Schema({
    level: { type: Number, required: true },
    weaponMatType: { type: String, required: true },
    weaponMatNum: { type: Number, required: true },
    eliteMatType: { type: String, required: true },
    eliteMatNum: { type: Number, required: true },
    comMatType: { type: String, required: true },
    comMatNum: { type: Number, required: true },
    mora: { type: Number, required: true },
});

const WeaponAscension = new Schema({
    stars: { type: Number, required: true },
    weaponStarAscen: [WeaponStarAscen],
});

const WeaponStarLevel = new Schema({
    level: { type: Number, required: true },
    cumulMora: { type: Number, required: true },
    cumulExp: { type: Number, required: true },
});

const WeaponLevel = new Schema({
    stars: { type: Number, required: true },
    weaponStarLevel: [WeaponStarLevel],
});

const Mat = new Schema({
    shortName: { type: String, required: true },
    white: { type: String, required: true },
    green: { type: String, required: true },
    blue: { type: String, required: true },
    purple: { type: String, required: true },
    gold: { type: String, required: true },
});

const MatName = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
});

const ExpMat = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    exp: { type: Number, required: true },
});

const Materials = new Schema({
    eleCrys: [Mat],
    comMat: [Mat],
    talentBook: [Mat],
    weaponMat: [Mat],
    eleMat: [MatName],
    locSpec: [MatName],
    bossMat: [MatName],
    weaponExp: [ExpMat],
    charExp: [ExpMat],
    misc: [MatName],
});

const Image = new Schema({
    name: { type: String, required: true },
    imgPath: { type: String, required: true },
});

const WeaponStars = new Schema({
    stars: { type: Number, required: true },
    weaponAscenLevels: { type: [Number], required: true },
});

const MatType = new Schema({
    multiType: { type: [String], required: true },
    singleType: { type: [String], required: true },
})

const ShortNames = new Schema({
    eleCrys: { type: [String], required: true },
    comMat: { type: [String], required: true },
    eliteMat: { type: [String], required: true },
    talentMat: { type: [String], required: true },
    weaponMat: { type: [String], required: true },
});

const MiscData = new Schema({
    charAscenLevels: { type: [Number], required: true },
    talentLevels: { type: [Number], required: true },
    weaponStars: [WeaponStars],
    matType: MatType,
    rarType: { type: [String], required: true },
    shortNames: ShortNames
});

const General = new Schema({
    name: { type: String, required: true },
    charList: [Character],
    charAscension: [CharAscension],
    charLevel: [CharLevel],
    talents: [Talent],
    weaponList: [Weapon],
    weaponAscension: [WeaponAscension],
    weaponLevel: [WeaponLevel],
    materials: Materials,
    img: [Image],
    miscData: MiscData,
});

module.exports = mongoose.model('general', General);