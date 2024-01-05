import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import models from "../models/";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("signup_form", { title: "signup" });
});

router.post(
  "/",
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords must match"),
  expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("signup_form", {
        title: "signup",
        error: errors.array()[0].msg
      });
    }

    const existingUser = await models.User.findOne({
      username: req.body.username
    });
    if (existingUser) {
      res.render("signup_form", {
        title: "signup",
        error: "Username taken"
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
