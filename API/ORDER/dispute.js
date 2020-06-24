const Router = require("express").Router();
const { Order, Notifications } = require("../../MODELS");
const { COMPLETED, DISPUTE, ORDERCANCELED } = require("../ORDER/orderStatus");
const { upload } = require("../../storage")();
const notificationSend = require("../NOTIFICATIONS/notifyConfig");

////////////////////////////////////////////////////////////////
Router.post("/cancel-dispute", upload.array("imgs", 2), (req, res) => {
  let { orderID, canceledBY } = req.body;

  Order.findOne({ _id: orderID })
    .then((foundOrder) => {
      if (foundOrder !== null) {
        foundOrder.orderStatus = "NEWORDER";
        //cancel by
        foundOrder.disputeHistory[
          foundOrder.disputeHistory.length - 1
        ].canceledBy = canceledBY;
        //cancel date
        foundOrder.disputeHistory[
          foundOrder.disputeHistory.length - 1
        ].cancelDate = Date.now();

        foundOrder.save().then((saved) => {
          if (saved) {
            return res
              .json({ msg: "Dispute Canceled", saved, success: true })
              .status(200);
          } else {
            return res
              .json({ msg: "Dispute Not Canceled", success: false })
              .status(404);
          }
        });
      } else {
        return res.json({ msg: "Not Found!", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

////////////////////////////////////////////////////////////////
Router.post("/create-dispute", upload.array("imgs", 2), (req, res) => {
  //   let { dispute } = req.body;
  let imageArrays = req.files;
  // return res.json(imageArrays[0].filename);
  let { data } = req.body;
  let dispute = JSON.parse(data);
  // let imgsArray = [];
  // imageArrays.forEach((eachFoundPic) => {
  //   imgsArray.push(`/files/vendor-files/image/${imageArrays[0].filename}`);
  // });
  Order.findOne({ _id: dispute.orderID })
    .populate({
      path: "service",
      populate: { path: "seller" },
    })
    .then(async (foundOrder) => {
      if (foundOrder !== null) {
        if (foundOrder.orderStatus === DISPUTE) {
          return res
            .json({ msg: "Order Alredy in Dispute", success: false })
            .status(404);
        } else {
          foundOrder.orderStatus = DISPUTE;
          foundOrder.createdBy = dispute.createdBy;
          /////////////////////
          //below token collection and payload prepration
          let tokensArray = [];
          let payload = {
            notification: {
              title: "Dispute Created!",
              body: `Your Order has dispute`,
            },
            data: {
              orderID: `${dispute.orderID}`,
            },
          };
          let newNotification = await new Notifications({
            title: payload.notification.title,
            body: payload.notification.body,
            seller: foundOrder.service.seller._id,
            user: foundOrder.user,
            notificationFor: "USER",
            notificationType: "DISPUTE",
            notificationDateTime: Date.now(),
          });
          let saveNotification = newNotification.save();
          if (saveNotification) {
            console.log("Notification Saved");
          } else {
            console.log("Notification Not Saved");
          }
          if (foundOrder.service.seller.mobileFcToken !== null) {
            tokensArray.push(foundOrder.service.seller.mobileFcToken);
          }
          if (foundOrder.service.seller.webFcToken !== null) {
            tokensArray.push(foundOrder.service.seller.webFcToken);
          }
          let isSendNotification = await notificationSend(tokensArray, payload);
          console.log(isSendNotification);
          if (isSendNotification) {
            console.log("Dispute Notification sent to Seller");
          }
          ///////////////////
          if (dispute.createdBy === "SELLER") {
            foundOrder.disputeHistory.push({
              seller: dispute.sellerOrUserID,
              createdBy: "SELLER",
              message: dispute.message,
              disputeImgUrls: `/files/vendor-files/image/${imageArrays[0].filename}`,
              disputeCreatedDate: Date.now(),
            });
          } else {
            foundOrder.disputeHistory.push({
              user: dispute.sellerOrUserID,
              createdBy: "USER",
              message: dispute.message,
              disputeImgUrls: `/files/vendor-files/image/${imageArrays[0].filename}`,
              disputeCreatedDate: Date.now(),
            });
          }
          foundOrder
            .save()
            .then((savedOrder) => {
              if (savedOrder) {
                return res
                  .json({ msg: "Dispute Created", savedOrder, success: true })
                  .status(200);
              } else {
                return res
                  .json({ msg: "Dispute Not Created", success: true })
                  .status(200);
              }
            })
            .catch((err) => {
              console.log(err);
              return res.json({ msg: "Failed", success: false }).status(504);
            });
        }
      } else {
        return res.json({ msg: "Not Found", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(504);
    });
});

module.exports = Router;
