const acceuille = require("./accuille");

module.exports = (app) => {
  app.use("/", acceuille);
};
