import "dotenv/config";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
import { Strategy } from "passport-local";
import bcrypt from "bcryptjs";

import models from "../models";

const addMiddleware = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true
    })
  );
  app.use(flash());
  passport.use(
    new Strategy(async (username, password, done) => {
      try {
        const user = await models.User.findByLogin(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await models.User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
  });
};

export default addMiddleware;
