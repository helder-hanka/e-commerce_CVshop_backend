const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likesSchema = new Schema({
  likes: {
    type: Number,
  },
  admin: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Admin",
  },
});

module.exports = mongoose.model("Like", likesSchema);
