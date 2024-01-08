import "dotenv/config";
import express from "express";
import path from "path";

import models, { connectDb } from "./models";
import routes from "./routes";
import addMiddleware from "./middleware";

const app = express();
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

addMiddleware(app);

app.use("/", routes.root);
app.use("/login", routes.login);
app.use("/signup", routes.signup);
app.use("/messages", routes.messages);

app.use((err, req, res) => {
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
