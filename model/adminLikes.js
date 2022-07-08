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
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Like", likesSchema);
