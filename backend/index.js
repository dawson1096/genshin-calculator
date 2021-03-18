const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const db = require("./src/db");

const passport = require("passport");
require("./src/config/passport")(passport);

const userRouter = require("./src/routes/user-route");

const app = express();
const apiPort = 3000;

app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend/build")));

db.on("error", console.error.bind(console, "MongoDB connection error"));
db.on("connected", function () {
  mongoose.set("debug", function (col, method, query, doc) {
    console.log(`MongoDB :: ${this.conn.name} ${col}.${method}()`);
  });
  console.log(`MongoDB :: connected ${this.name}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", userRouter);
app.use("/api", express.static(__dirname + "/public"));

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
