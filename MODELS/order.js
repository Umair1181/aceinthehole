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
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    default: "NEWORDER", // COMPLETED,DISPUTE,ORDERCANCELED
    required: true,
  },
  createdBy: {
    //dispute creator
    type: String,
    // default: "USER",
    // required: true,
  },
  disputeHistory: [
    {
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tblsellers",
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tblusers",
      },
      //dispute creator
      createdBy: {
        type: String,
        // default: "USER",
      },
      message: {
        type: String,
      },
      disputeImgUrls: [
        {
          type: String,
        },
      ],
      disputeCreatedDate: {
        type: Date,
        // default: Date.now(),
      },
      //below cancel info
      cancelDate: {
        type: Date,
        // default: Date.now(),
      },
      canceledBy: {
        type: String,
        // default: "ADMIN", //USER, SELLER
      },
    },
  ],
  reqDay: {
    //order of service req day
    type: Date,
    default: Date.now(),
  },
  reqTime: {
    type: Date,
  },
});
module.exports = mongoose.model("tblorders", Order);
