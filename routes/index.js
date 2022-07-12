const products = require("./admin");
const authAdmin = require("./auths/admin");
const authAdminCvShop = require("./auths/adminCvShop");

module.exports = (app) => {
  app.use("/admin", products);
  app.use("/auth", authAdmin);
  app.use("/auth", authAdminCvShop);
};
