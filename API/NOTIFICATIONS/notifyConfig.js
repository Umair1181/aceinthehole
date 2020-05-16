const admin = require("firebase-admin");
const serviceAccount = require("./aceinthehole-c8833-firebase-adminsdk-5cs75-1a3fa60004.json");
//db url need chnage
const databaseURL = "https://aceinthehole-c8833.firebaseio.com";
////////Intializ App/////////////
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL,
});

let options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
  sound: "default",
};

/////Function for send a notification to device
module.exports = (fcToken, payload) => {
  admin
    .messaging()
    .sendToDevice(fcToken, payload, options)
    .then((send) => {
      if (send) {
        console.log("Notification Send!");
        return true;
      } else {
        console.log("Not Send!");
        return false;
      }
    })
    .catch((err) => {
      console.log("Error found!");
      console.log(err);
      return false;
    });
};
