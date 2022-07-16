const products = require("./admin");
const authAdmin = require("./auths/admin");
const authAdminCvShop = require("./auths/adminCvShop");
const adminCvShop = require("./adminCvShop");

module.exports = (app) => {
  app.use("/admin", products);
  app.use("/auth", authAdmin);
  app.use("/auth", authAdminCvShop);
  app.use("/admin_cv_shop", adminCvShop);
};
