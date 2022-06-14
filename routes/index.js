const products = require("./admin");

module.exports = (app) => {
  app.use("/admin", products);
};
