import path from "path";
import supertest from "supertest";
import express from "express";
import mongoose from "mongoose";

import login from "../login";
import addMiddlewares from "../../middleware";
import { connectDb } from "../../models";

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
  supertest(app).get("/").expect("Content-Type", /html/).expect(200, done);
});

describe("login integrity", () => {
  let agent;

  beforeAll(async () => {
    await connectDb();
    agent = supertest.agent(app);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("login with bad credentials should fail and redirect to /login", async () => {
    const response = await supertest(app).post("/").type("form").send({
      username: "wu", // invalid username
      password: "wrongpassword"
    });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/login");
  });

  test("login with good credentials should succeed and redirect to /", async () => {
    const response = await supertest(app).post("/").type("form").send({
      username: process.env.GOODUSER,
      password: process.env.GOODPASS
    });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/");
  });

  test("logout after login should succeed and redirect to /", async () => {
    await agent
      .post("/")
      .type("form")
      .send({ username: "charles", password: "charles" })
      .expect(302)
      .expect("location", "/");

    await agent.post("/out").expect(302).expect("location", "/");
  });
});
