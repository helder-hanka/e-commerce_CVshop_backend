const products = require("./product");

module.exports = (app) => {
  app.use("/product", products);
};
