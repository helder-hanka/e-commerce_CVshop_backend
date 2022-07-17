const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const adminCvShopPaymentSchema = new Schema(
  {
    payment_type: {
      type: String,
      required: true,
      enum: ["cash payment", "online payment"],
    },
    provider: {
      type: String,
    },
    account_no: {
      type: Number,
    },
    expiry: {
      type: Date,
      required: true,
    },
    permissions: {
      type: Boolean,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    comments: {
      type: String,
    },
    validatePaymentReceved: {
      type: Boolean,
      required: true,
    },
    confirmPaymentGive: {
      type: Boolean,
      required: true,
    },
    admin_cvShop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "AdminCvShop",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminCvShopPayment", adminCvShopPaymentSchema);
