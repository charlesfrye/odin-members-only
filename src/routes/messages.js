import express from "express";
import expressAsyncHandler from "express-async-handler";
import models from "../models";

const router = express.Router();

router.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    if (!req.user) {
      res.redirect("/login");
    }
    const user = await models.User.findById(req.user.id);
    if (user.membershipStatus === "read") {
      res.redirect("/signup/promote");
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

router.get(
  "/:id/delete",
  expressAsyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      res.redirect("/login");
    }
    await models.Message.findByIdAndDelete(req.params.id);
    res.redirect("/");
  })
);

export default router;
