import { Schema, model, Document } from "mongoose";
import uV from "mongoose-unique-validator";

interface AdminFor extends Document {
  email: string;
  password: string;
  adminCvShopId: Schema.Types.ObjectId;
}

const adminCvShopSchema = new Schema<AdminFor>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    adminCvShopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "AdminCvShop",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

adminCvShopSchema.plugin(uV, {
  message: "Error, expected {PATH} to be unique.",
});

adminCvShopSchema.virtual("Payments", {
  ref: "AdminCvShopPayment",
  localField: "_id",
  foreignField: "admin_cvShop",
});
adminCvShopSchema.virtual("Adress", {
  ref: "AdminCvShopAdress",
  localField: "_id",
  foreignField: "admin_cvShop",
});

export default model<AdminFor>("AdminCvShop", adminCvShopSchema);
