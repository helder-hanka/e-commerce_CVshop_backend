const express = require("express");
const cors = require("cors");
const { SERVER_PORT } = require("./env");
console.log("SERVER_PORT: ", SERVER_PORT);

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
app.use((req, res, next) => {
  const totalCount = req.headers["x-total-count"];
  console.log("totalCount :", totalCount);
  res.set("X-Total-Count", totalCount);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on : ${SERVER_PORT}`);
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

module.exports = server;
