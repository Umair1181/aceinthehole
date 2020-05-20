const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Seller = new Schema({
  sellerName: {
    type: String,
  },
  webSite: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
    default: "+0",
  },
  password: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  regDate: {
    type: Date,
    default: Date.now(),
  },
  address: {
    type: String,
  },
  sellerStatus: {
    type: String,
    default: "NEWSELLER",
  },
  isBlock: {
    type: Boolean,
    default: false,
  },
  isOnline: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
  },
  RandomNumber: {
    type: Number,
  },
  gender: {
    type: String,
  },
  profileImgURL: {
    type: String,
  },
  idCardImgURL: {
    type: String,
  },
  webFcToken: {
    type: String,
    default: null,
  },
  mobileFcToken: {
    type: String,
    default: null,
  },
  Bill: {
    type: {
      billingName: {
        type: String,
      },
      // country: {
      //   type: String
      // },
      billingAddress: {
        type: String,
      },
      billingContact: {
        type: String,
      },
    },
  },
  Bank: {
    type: {
      cardNumber: {
        type: String,
      },
      AccountTitle: {
        type: String,
      },
      ExpireDate: {
        type: String,
      },
      Cvv: {
        type: String,
      },
    },
  },
  paypalAccountEmail: {
    type: String,
  },
});
module.exports = mongoose.model("tblsellers", Seller);
