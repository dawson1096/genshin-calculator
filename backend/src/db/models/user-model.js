const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Character = new Schema({
    name: { type: String, required: true },
    stars: { type: Number, required: true },
});

const Weapon = new Schema({
    name: { type: String, required: true },
    stars: { type: Number, required: true },
});

const Mat = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    number: { type: Number, required: true },
});

const Materials = new Schema({
    eleCrys: [Mat],
    eleMat: [Mat],
    locSpec: [Mat],
    comMat: [Mat],
    talenBook: [Mat],
    weaponExp: [Mat],
    charExp: [Mat],
});

const Data = new Schema({
    charList: [Character],
    weaponList: [Weapon],
    materials: Materials,
    mora: { type: Number, required: true },
});

const User = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    data: Data
});

module.exports = mongoose.model("user", User);