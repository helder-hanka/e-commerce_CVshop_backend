import mongoose from "mongoose";
const Schema = mongoose.Schema;
const adminCvShopAdress = new Schema(
  {
    AdminCvShop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "AdminCvShop",
    },
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
    image: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postal_code: {
      type: String,
      required: true,
    },
    tephone: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminCvShopAdress", adminCvShopAdress);
