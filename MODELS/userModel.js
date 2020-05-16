const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  userStatus: {
    type: String,
    default: "newUser",
  },
  userName: {
    type: String,
    default: "dummy",
  },
  email: {
    type: String,
    required: true,
  },
  RandomNumber: {
    type: String,
    default: null,
  },
  //   phoneNumber: {
  //     type: String,
  //     default: false
  //   },
  password: {
    type: String,
  },
  gender: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },

  // address: {
  //   type: String
  // },
  webFcToken: {
    type: String,
    default: null,
  },
  mobileFcToken: {
    type: String,
    default: null,
  },
  profileImgURL: [
    {
      type: String,
      default: "/files/vendor-files/image/4ac52dd5e908961c7cb9954cb5375b15.jpg",
    },
  ],
  isOnlineStatus: {
    type: Boolean,
    default: true,
  },
  dateOfBirth: {
    type: Date,
  },
  registerDate: {
    type: Date,
    default: Date.now(),
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
      // paypalAccountEmail: {
      //   type: String,
      // },
    },
  },
});
module.exports = mongoose.model("tblusers", User);
