const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const currentUserCommandSchema = new Schema(
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
    userValidation: {
      type: Boolean,
      required: true,
    },
    adminValidation: {
      type: Boolean,
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
      mobile: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("currentUserCommand", currentUserCommandSchema);
