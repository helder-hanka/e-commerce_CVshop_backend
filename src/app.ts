import { Request, Response, NextFunction } from "express";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import { DB_PORT, DB_HOST } from "./env";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    exposedHeaders: ["Content-Range", "X-Content-Range", "X-Total-Count"],
    origin: "http://localhost:3001",
  })
);
app.use(bodyParser.json());

app.use("./images/products", express.static(path.join(__dirname, "images")));
app.use(
  "./images/productsDelete",
  express.static(path.join(__dirname, "images"))
);
app.use("./images/adress", express.static(path.join(__dirname, "images")));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const totalCount = req.headers["x-total-count"];
  console.log("totalCount :", totalCount);
  res.set("X-Total-Count", totalCount);
  next();
});

require("./routes")(app);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(`mongodb://${DB_HOST}:${DB_PORT}/CVshop`)
  .then((server) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });

export default app;

// process.on("unhandledRejection", (error) => {
//   console.error("unhandledRejection", JSON.stringify(error), error.stack);
//   process.exit(1);
// });

// process.on("uncaughtException", (error) => {
//   console.error("uncaughtException", JSON.stringify(error), error.stack);
//   process.exit(1);
// });

// process.on("beforeExit", () => {
//   app.close((error) => {
//     if (error) console.error(JSON.stringify(error), error.stack);
//   });
// });
