const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productsDeletedSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
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
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("ProductDeleted", productsDeletedSchema);