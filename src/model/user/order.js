const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new Schema(
  {
    products: [
      {
        products: {
          type: Object,
          require: true,
        },
      },
    ],
    quantityTotal: {
      type: Number,
      required: true,
    },
    priceTotal: {
      type: Number,
      required: true,
    },
    user: {
      userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
