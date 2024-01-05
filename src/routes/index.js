import login from "./login";
import signup from "./signup";
import messages from "./messages";

import models from "../models/";

const express = require("express");
const root = express.Router();

root.get("/", async function (req, res, next) {
  const allMessages = await models.Message.find()
    .sort({ createdAt: -1 })
    .populate("user");
  res.render("index", { title: "The ClubHouse", messages: allMessages });
});

export default {
  root,
  login,
  signup,
  messages
};
