const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  userName: {
    type: String,
    default: "dummy"
  },
  email: {
    type: String,
    required: true
  },
  RandomNumber: {
    type: String,
    default: null
  },
  //   phoneNumber: {
  //     type: String,
  //     default: false
  //   },
  password: {
    type: String
  },

  // address: {
  //   type: String
  // },

  profileImgURL: [
    {
      type: String,
      default: "/files/vendor-files/image/4ac52dd5e908961c7cb9954cb5375b15.jpg"
    }
  ],
  //   isActiveStatus: {
  //     type: Boolean,
  //     default: true
  //   }
  registerDate: {
    type: Date,
    default: Date.now()
  }
});
module.exports = mongoose.model("tblusers", User);
