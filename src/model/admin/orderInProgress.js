const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const currentAdminCommandSchema = new Schema(
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
        quantityTotal: { type: Number, required: true },
        priceTotal: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "currentAdminCommand",
  currentAdminCommandSchema
);
