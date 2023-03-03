const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: [
      {
        type: String,
        required: true,
      },
    ],
    like: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    colors: [
      {
        type: String,
      },
    ],
    size: [
      {
        type: String,
      },
    ],
    origin: {
      type: String,
    },
    marque: {
      type: String,
    },
    occasion: {
      type: Boolean,
      required: true,
    },
    men: {
      type: Boolean,
      required: true,
    },
    women: {
      type: Boolean,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "clothes",
        "cars",
        "homeAppliance",
        "decorations",
        "computerScience",
        "books",
        "accessory",
      ],
    },
    confirmDisplay: {
      type: Boolean,
      required: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productsSchema);
