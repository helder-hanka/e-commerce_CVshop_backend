const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // admin_cvShop: {
  //   type: Schema.Types.ObjectId,
  //   required: true,
  //   ref: "admin_cvShop",
  // },
});

module.exports = mongoose.model("Admin", adminSchema);
