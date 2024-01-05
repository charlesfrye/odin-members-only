import express from "express";
import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import models from "../models/";

const router = express.Router();

router.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    if (!req.user) {
      res.redirect("/login");
    }
    const user = await models.User.findById(req.user.id);
    if (user.membershipStatus === "read") {
      res.redirect("/");
    } else {
      const message = new models.Message({
        user: req.user.id,
        text: req.body.text
      });
      await message.save();
      res.redirect("/");
    }
  })
);

export default router;
