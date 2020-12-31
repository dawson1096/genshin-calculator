const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TalentReq = new Schema({
    name: { type: String, required: true },
    curLvl: { type: Number, required: true },
    reqLvl: { type: Number, required: true },
    imgPath: { type: String, required: true},
});

const Character = new Schema({
    name: { type: String, required: true },
    stars: { type: Number, required: true },
    curLvl: { type: Number, required: true },
    reqLvl: { type: Number, required: true },
    autoAttack: TalentReq,
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
    name: String,
    type: String,
    number: Number,
    imgPath: String,
});

const MultiMat = new Schema({
    name: String,
    matList: [Mat],
});

const ExpMat = new Schema({
    name: String,
    type: String,
    number: String,
    exp: Number,
    imgPath: String,
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
    weaponExp: [ExpMat],
    charExp: [ExpMat],
    misc: [Mat],
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