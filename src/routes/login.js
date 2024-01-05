import express from "express";
import { User } from "../models/";
import passport from "passport";

const router = express.Router();

router.get("/", async (req, res) => {
  res.render("login_form", { title: "login" });
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

export default router;
