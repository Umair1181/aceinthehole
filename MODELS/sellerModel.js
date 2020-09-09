const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Seller = new Schema({
  location: {
    longitude: { type: Number, default: 0 },
    latitude: { type: Number, default: 0 },
  },
  sellerAvgRating: {
    type: Number,
    default: 0,
  },

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
  accountType: {
    type: String,
    default: "LOCAL",
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
  isOrderBlocked: {
    type: Boolean,
    default: false,
  },
  isProfileCompleted: {
    type: Boolean,
    default: false,
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
  isPaypalVerified: {
    type: Boolean,
    default: false,
  },
  stripeAccountId: {
    type: String,
    // default: "not found",
  },
  isStripeVerified: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("tblsellers", Seller);
