const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const adminAdressSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  admin: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Admin",
  },
  imageUrl: {
    type: String,
  },
  address_line_1: {
    type: String,
  },
  address_line_2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  postal_code: {
    type: Number,
  },
  country: {
    type: String,
    required: true,
  },
  telephone: {
    type: Number,
  },
  mobile: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("AdminAdress", adminAdressSchema);
