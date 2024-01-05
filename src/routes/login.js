import express from "express";
import expressAsyncHandler from "express-async-handler";
import { User } from "../models/";
import passport from "passport";

const router = express.Router();

router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const errors = req.flash("error");
    res.render("login_form", {
      title: "login",
      error: errors.length ? errors[0] : null
    });
  })
);

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.delete(
  "/",
  expressAsyncHandler(async (req, res) => {
    req.logout();
    res.redirect("/");
  })
);

export default router;
