const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Reviews = new Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tblorders",
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tblservices",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tblusers",
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: null,
  },
  reviewDateTime: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("tblreviewss", Reviews);
