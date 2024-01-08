import path from "path";
import request from "supertest";
import express from "express";
import login from "../login";
import addMiddlewares from "../../middleware";

const app = express();
app.set("views", path.join(__dirname, "../../../views"));
app.set("view engine", "ejs");

addMiddlewares(app);

app.use("/", login);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).send({ error: error.message });
});

test("index route works ", (done) => {
  request(app).get("/").expect("Content-Type", /html/).expect(200, done);
});
