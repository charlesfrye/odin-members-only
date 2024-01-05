import express from "express";
import expressAsyncHandler from "express-async-handler";
import { User } from "../models/";
import passport from "passport";

const router = express.Router();

router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    res.render("login_form", { title: "login" });
  })
);

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
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
