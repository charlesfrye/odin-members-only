import express from "express";
import expressAsyncHandler from "express-async-handler";
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
  expressAsyncHandler(async (req, res, next) => {
    req.logout((errLogout) => {
      if (errLogout) {
        next(errLogout);
      }
      req.session.destroy((errSession) => {
        if (errSession) {
          next(errSession);
        }
        res.redirect("/");
      });
    });
  })
);

export default router;
