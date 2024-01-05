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

router.post(
  "/out",
  expressAsyncHandler(async (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  })
);

export default router;
