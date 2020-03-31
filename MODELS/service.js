const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Service = new Schema({
  serviceName: {
    type: String
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tblsellers"
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tblservicecategorys"
  },
  price: {
    type: String
  },
  description: {
    type: String
  },
  serviceDaysArray: [
    {
      type: String,
      default: "+0"
    }
  ],
  toTime: {
    type: String
  },
  fromTime: {
    type: String
  },

  serviceImgsURLs: [
    {
      type: String
    }
  ],
  certificatesImgsURLs: [
    {
      type: String
    }
  ]
});
module.exports = mongoose.model("tblservices", Service);
