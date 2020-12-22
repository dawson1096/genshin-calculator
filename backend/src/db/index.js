const mongoose = require("mongoose");
const { userConURI } = require("../config/config");

mongoose
    .connect(userConURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(e => {
        console.log('Connection error', e.message)
    });

const db = mongoose.connection;

module.exports = db;