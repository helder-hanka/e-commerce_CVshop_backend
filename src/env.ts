require("dotenv").config();

const getEnv = (variable: string) => {
  const value = process.env[variable];
  return value;
};

const SERVER_PORT = getEnv("SERVER_PORT");
const DB_HOST = getEnv("DB_HOST");
const DB_PORT = getEnv("DB_PORT");
const SECRET_ADMIN_CVSHOP_KEY = getEnv("SECRET_ADMIN_CVSHOP_KEY");

export { SERVER_PORT, DB_HOST, DB_PORT, SECRET_ADMIN_CVSHOP_KEY };
