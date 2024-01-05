import login from "./login";
import signup from "./signup";
import messages from "./messages";

const express = require("express");
const root = express.Router();

root.get("/", function (req, res, next) {
  res.render("index", { title: "The ClubHouse" });
});

export default {
  root,
  login,
  signup,
  messages
};
