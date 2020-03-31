const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Seller = new Schema({
  sellerName: {
    type: String
  },
  webSite: {
    type: String
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: String,
    default: "+0"
  },
  password: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  regDate: {
    type: Date,
    default: Date.now()
  },
  address: {
    type: String
  },
  isOnline: {
    type: Boolean,
    default: true
  },
  description: {
    type: String
  },
  RandomNumber: {
    type: Number
  },
  gender: {
    type: String
  },
  profileImgURL: {
    type: String
  },
  idCardImgURL: {
    type: String
  }
});
module.exports = mongoose.model("tblsellers", Seller);
