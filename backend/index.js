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
app.get("/weapons", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
app.get("/characters", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
app.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
app.get("/register", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
app.get("/dashboard", function (req, res) {
  if (req.token !== "Unauthorized") {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  }
});

db.on("error", console.error.bind(console, "MongoDB connection error"));
db.on("connected", function () {
  mongoose.set("debug", function (col, method, query, doc) {
    console.log(`MongoDB :: ${this.conn.name} ${col}.${method}()`);
  });
  console.log(`MongoDB :: connected ${this.name}`);
});

app.use("/api", userRouter);
app.use("/api", express.static(__dirname + "/public"));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
