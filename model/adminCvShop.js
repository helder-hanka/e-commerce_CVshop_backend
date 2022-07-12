const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const adminCvShopSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    adminCvShop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "AdminCvShop",
    },
    // admin: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     required: true,
    //     ref: "Admin",
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminCvShop", adminCvShopSchema);
