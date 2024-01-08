import path from "path";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";

const addMiddleware = (app) => {
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

  const staticFolderPath = path.join(__dirname, "../../public");
  app.use("/static", express.static(staticFolderPath));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
};

export default addMiddleware;
