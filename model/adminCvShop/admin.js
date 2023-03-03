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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
  { timestamps: true }
);

adminCvShopSchema.virtual("Payments", {
  ref: "AdminCvShopPayment",
  localField: "_id",
  foreignField: "admin_cvShop",
});
adminCvShopSchema.virtual("Adress", {
  ref: "AdminCvShopAdress",
  localField: "_id",
  foreignField: "admin_cvShop",
});

module.exports = mongoose.model("AdminCvShop", adminCvShopSchema);
