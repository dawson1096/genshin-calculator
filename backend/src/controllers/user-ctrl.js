const User = require("../db/models/user-model");
const GeneralCtrl = require("./general-ctrl");

// //console.log(generalData);

// createGeneral = (req, res) => {
//     const body = req.body;

//     if (!body) {
//         return res.status(400).json({
//             success: false,
//             error: 'You must provide data',
//         });
//     }

//     const general = new General(body);

//     if (!general) {
//         return res.status(400).json({ success: false, error: err });
//     }

//     General.replaceOne({ name: "general" }, general, { upsert: true });
// }

// getGeneral = async (req, res) => {
//     await General.find({}, (err, general) => {
//         if (err) {
//             return res.status(400).json({ success: false, error: err });
//         }
//         if (!general.length) {
//             return res
//                 .status(404)
//                 .json({ success: false, error: `General data not found` });
//         }
//         return res.status(200).json({ success: true, data: general });
//     }).catch(err => console.log(err));
// }

module.exports = {
};