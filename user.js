const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  biography: {
    type: String,
    required: true,
  },
  following_count: {
    type: String,
    required: true,
  },
  follows_count: {
    type: String,
    required: true,
  },
  posts_count: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  is_verified: {
    type: Boolean,
    required: true,
  },
  is_private: {
    type: Boolean,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
