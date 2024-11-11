const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userAdressSchema = new Schema(
  {
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
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserAdress", userAdressSchema);
