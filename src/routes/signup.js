import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import models from "../models";

const router = express.Router();

router.get("/", (_req, res) => {
  res.render("signup_form", { title: "sign up" });
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
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match"),
  expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("signup_form", {
        title: "sign up",
        error: errors.array()[0].msg
      });
    }

    const existingUser = await models.User.findOne({
      username: req.body.username
    });
    if (existingUser) {
      res.render("signup_form", {
        title: "sign up",
        error: "Username taken"
      });
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

router.get(
  "/promote",
  expressAsyncHandler(async (req, res) => {
    if (!req.user) {
      res.redirect("/login");
    }
    res.render("promote_form", { title: "get promoted" });
  })
);

router.post(
  "/promote",
  body("secret")
    .trim()
    .isLength({ min: 1 })
    .withMessage("the secret is required"),
  expressAsyncHandler(async (req, res, _next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("promote_form", {
        title: "get promoted",
        error: errors.array()[0].msg
      });
    }

    const user = await models.User.findById(req.user.id);

    if (req.body.secret === process.env.WRITE_SECRET) {
      user.membershipStatus = "write";
    } else if (req.body.secret === process.env.ADMIN_SECRET) {
      user.membershipStatus = "admin";
    } else {
      res.render("promote_form", {
        title: "get promoted",
        error: "not the secret"
      });
    }
    await user.save();
    res.redirect("/");
  })
);

export default router;
