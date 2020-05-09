const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema({
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
  price: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    default: "NEWORDER", // DELIVERED,DISPUTE,REVEIVED,COMPLETE,ORDERCANCELED,DISPUTECANCELED
    required: true,
  },
  disputeHistory: {
    type: String,
    required: true,
  },
  reqDay: {
    type: Date,
    default: Date.now(),
  },
  reqTime: {
    type: Date,
  },
});
module.exports = mongoose.model("tblorders", Order);
