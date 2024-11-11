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
    // colors: [
    //   {
    //     color: { type: String, required: true },
    //     quantity: { type: String, required: true },
    //   },
    // ],
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
    // childBoy: { à rajouter
    //   type: Boolean,
    //   required: true,
    // },
    // childGirl: {
    //   type: Boolean,
    //   required: true,
    // },
    // auteur: {type: String},
    // compositionMateriel: {type: String},
    // brand:{
    //   type: String,
    //   required: true
    // },
    category: {
      type: String,
      required: true,
      enum: [
        "clothes",
        // "cars",
        "homeAppliance",
        "decorations",
        "computerScience",
        "books",
        "accessory",
        "sport",
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
