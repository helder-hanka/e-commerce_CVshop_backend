const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const backOrderSchema = new Schema(
  {
    userValidation: {
      type: Boolean,
      required: true,
    },
    adminValidation: {
      type: Boolean,
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    adminId: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantityBuy: { type: Number, required: true },
        priceBuy: { type: Number, required: true },
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
  { timestamps: true }
);

module.exports = mongoose.model("BackOrder", backOrderSchema);
