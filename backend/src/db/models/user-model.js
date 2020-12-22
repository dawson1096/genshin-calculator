const mongoose = require("mongoose");
const { getAllTalentReq } = require("../../controllers/general-ctrl");
const Schema = mongoose.Schema;

const TalentReq = new Schema({
    curLvl: { type: Number, required: true },
    reqLvl: { type: Number, required: true },
    imgPath: { type: String, required: true},
});

const Character = new Schema({
    name: { type: String, required: true },
    stars: { type: Number, required: true },
    curLvl: { type: Number, required: true },
    reqLvl: { type: Number, required: true },
    auttoAttack: TalentReq,
    eleSkill: TalentReq,
    eleBurst: TalentReq,
    imgPath: { type: String, required: true },
});

const Weapon = new Schema({
    name: { type: String, required: true },
    stars: { type: Number, required: true },
    number: { type: Number, required: true },
    curLvl: { type: Number, required: true },
    reqLvl: { type: Number, required: true },
    imgPath: { type: String, required: true },
});

const Mat = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    number: { type: Number, required: true },
    imgPath: { type: String, required: true },
});

const MultiMat = new Schema({
    name: { type: String, required: true },
    matList: [Mat],
});

const ExpMat = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    number: { type: Number, required: true },
    exp: { type: Number, required: true },
    imgPath: { type: String, required: true },
});

const Exp = new Schema({
    mat: [ExpMat],
    wastedExp: { type: Number, required: false },
});

const Materials = new Schema({
    eleCrys: [MultiMat],
    eleMat: [Mat],
    locSpec: [Mat],
    comMat: [MultiMat],
    eliteMat: [MultiMat],
    bossMat: [Mat],
    talentMat: [MultiMat],
    weaponMat: [MultiMat],
    weaponExp: Exp,
    charExp: Exp,
    crownNum: { type: Number, required: true },
    mora: { type: Number, required: true },
});

const Data = new Schema({
    charList: [Character],
    weaponList: [Weapon],
    materials: Materials,
});

const User = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    userData: Data,
});

module.exports = mongoose.model("users", User);