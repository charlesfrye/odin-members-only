import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import path from "path";
import bcrypt from "bcryptjs";

import models, { connectDb } from "./models";
import routes from "./routes";

const app = express();
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

const logger = morgan("combined");
app.use(logger);

app.use(cors());
app.use(helmet());
app.use(compression());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100
});
app.use(limiter);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);
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

const staticFolderPath = path.join(__dirname, "../public");
console.log(`staticFolderPath: ${staticFolderPath}`);
app.use("/static", express.static(staticFolderPath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", routes.root);
app.use("/login", routes.login);
app.use("/signup", routes.signup);
app.use("/messages", routes.messages);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const eraseDatabaseOnSync = process.env.eraseDatabaseOnSync || false;

connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.User.deleteMany({}),
      models.Message.deleteMany({})
    ]);
  }
  app.listen(process.env.PORT || 3000, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`)
  );
});
