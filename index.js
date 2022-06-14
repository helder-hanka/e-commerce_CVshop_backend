const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { SERVER_PORT, DB_PORT, DB_HOST } = require("./env");

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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((req, res, next) => {
  const totalCount = req.headers["x-total-count"];
  console.log("totalCount :", totalCount);
  res.set("X-Total-Count", totalCount);
  next();
});

require("./routes")(app);

mongoose
  .connect(`mongodb://${DB_HOST}:${DB_PORT}/CVshop`)
  .then((server) => {
    app.listen(SERVER_PORT, () => {
      console.log(`Server is listening on : ${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

process.on("unhandledRejection", (error) => {
  console.error("unhandledRejection", JSON.stringify(error), error.stack);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("uncaughtException", JSON.stringify(error), error.stack);
  process.exit(1);
});

process.on("beforeExit", () => {
  app.close((error) => {
    if (error) console.error(JSON.stringify(error), error.stack);
  });
});
