import mongoose from "mongoose";
const Schema = mongoose.Schema;
const adminCvShopPaymentSchema = new Schema(
  {
    payment_type: {
      type: String,
      required: true,
      enum: ["cash payment", "online payment"],
    },
    amount: {
      type: Number,
      required: true,
    },
    provider: {
      type: Number,
    },
    account_no: {
      type: Number,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    comments: {
      type: String,
    },
    AdminCvShop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "AdminCvShop",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminCvShopPayment", adminCvShopPaymentSchema);
