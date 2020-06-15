const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notifications = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  //   price: {
  //     type: Number,
  //   },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tblsellers",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tblusers",
  },
  notificationFor: {
    type: String,
    default: "USER",
  },
  notificationType: {
    type: String,
    default: "LATEST",
  },
  //   NotificationsImgURL: [
  //     {
  //       type: String,
  //     },
  //   ],
  NotificationsAddByAdmin: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("tblNotificationss", Notifications);
