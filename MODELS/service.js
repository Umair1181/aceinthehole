const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Service = new Schema({
  serviceName: {
    type: String,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tblsellers",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tblservicecategorys",
  },
  price: {
    type: String,
  },
  serviceStatus: {
    type: String, //pending approve reject
    default: "PENDING",
  },

  isLive: {
    //seller can publish/unblish his service
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
  },
  serviceDaysArray: [
    {
      day: {
        type: String,
      },
      toTime: {
        type: Date,
      },
      fromTime: {
        type: Date,
      },
    },
  ],

  serviceImgsURLs: [
    {
      type: String,
    },
  ],
  certificatesImgsURLs: [
    {
      type: String,
    },
  ],
});
module.exports = mongoose.model("tblservices", Service);
