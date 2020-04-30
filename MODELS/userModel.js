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
});
module.exports = mongoose.model("tblusers", User);
