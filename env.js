require("dotenv").config();

const getEnv = (variable) => {
  const value = process.env[variable];
  return value;
};

const SERVER_PORT = getEnv("SERVER_PORT");
const DB_HOST = getEnv("DB_HOST");
const DB_PORT = getEnv("DB_PORT");

module.exports = {
  SERVER_PORT,
  DB_HOST,
  DB_PORT,
};
