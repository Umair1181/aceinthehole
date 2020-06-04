// import { Router } from "express";
const Router = require("express").Router();
const { Notifications } = require("../../MODELS");

Router.post("/show-all-notifications-of-specific-seller", (req, res) => {
  let { sellerID } = req.body;
  Notifications.find({ seller: sellerID })
    .populate({ path: "user" })
    .populate({ path: "seller" })
    .then((foundNotifications) => {
      if (foundNotifications.length > 0) {
        return res
          .json({
            msg: "All Notifications of seller",
            foundNotifications,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "No Notification",
            success: false,
          })
          .status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});

Router.post("/show-all-notifications-of-specific-user", (req, res) => {
  let { userID } = req.body;
  Notifications.find({ user: userID })
    .populate({ path: "user" })
    .populate({ path: "seller" })
    .then((foundNotifications) => {
      if (foundNotifications.length > 0) {
        return res
          .json({
            msg: "All Notifications of user",
            foundNotifications,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "No Notification",
            success: false,
          })
          .status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});

Router.post("/show-all-notifications-of-system", (req, res) => {
  // return res.json("t"); seller

  Notifications.find()
    .populate({ path: "user" })
    .populate({ path: "seller" })
    .then((foundNotifications) => {
      if (foundNotifications.length > 0) {
        return res
          .json({
            msg: "All Notifications in system",
            foundNotifications,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "No Notification",
            success: false,
          })
          .status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});
module.exports = Router;
