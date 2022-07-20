const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    display: {
      type: Boolean,
      required: true,
    },
    admin_cvShop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "admin_cvShop",
    },
  },
  { timestamps: true },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

adminSchema.virtual("adress", {
  ref: "AdminAdress",
  localField: "_id",
  foreignField: "admin",
});
adminSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "admin",
});

module.exports = mongoose.model("Admin", adminSchema);
