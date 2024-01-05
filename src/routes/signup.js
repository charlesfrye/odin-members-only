import express from "express";
import bcrypt from "bcryptjs";

import models from "../models/";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("signup_form", { title: "signup" });
});

router.post(
  "/",
  expressAsyncHandler(async (req, res, next) => {
    const existingUser = await models.User.findOne({
      username: req.body.username
    });
    if (existingUser) {
      res.render("signup_form", {
        title: "signup",
        error: "Username already exists"
      });
      return;
    }
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        next(err);
      }
      const user = new models.User({
        username: req.body.username,
        password: hashedPassword,
        membershipStatus: "read"
      });
      await user.save();
      res.redirect("/login");
    });
  })
);

export default router;
