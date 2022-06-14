const mongoose = require("mongoose");
const { DB_PORT } = require("./env");
console.log("DB_HOST: ", DB_PORT);

// const db = mongoose.connect(`${DB_HOST}`).catch((error) => handleError(error));
// try {
//   console.log("connecté");
// } catch (error) {
//   handleError(error);
//}

const db = mongoose.connect(
  `mongodb://${DB_PORT}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
  // MONGODB_URI
);

module.exports = db;
