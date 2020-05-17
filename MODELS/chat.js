const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Chat = new Schema({
  msgOffer: [
    {
      myType: {
        type: String
      },
      payload: {
        type: Object
      },
      to: {
        type: String
      },
      from: {
        type: String
      },
      offerStatus: {
        type: Boolean,
        default: true
      },
      randomId:{
        type: String
      },
      time: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tblusers"
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tblsellers"
  },
  date: {
    type: Date,
    default: Date.now()
  }
});
module.exports = mongoose.model("tblchats", Chat);
