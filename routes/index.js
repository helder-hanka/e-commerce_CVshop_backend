const products = require("./admin");
const authAdmin = require("./auths/admin");

module.exports = (app) => {
  app.use("/admin", products);
  app.use("/auth", authAdmin);
};
