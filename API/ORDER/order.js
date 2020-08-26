const Router = require("express").Router();
const { Order, Reviews, Service, Notifications } = require("../../MODELS");
const notificationSend = require("../NOTIFICATIONS/notifyConfig");
const { update } = require("../../MODELS/cart");
////////////////////////////////////////////////////////////////
Router.post("/change-order-status", (req, res) => {
  let { orderID, orderStatus, statusChangeBy } = req.body;
  let setStatusChangeBy = null;
  setStatusChangeBy = statusChangeBy;
  Order.findOne({ _id: orderID })
    .then((foundOrder) => {
      if (foundOrder !== null) {
        foundOrder.orderStatus = orderStatus;
        if (setStatusChangeBy !== null) {
          foundOrder.statusChangeBy = setStatusChangeBy;
        } else {
          foundOrder.statusChangeBy = "SELLER";
          setStatusChangeBy = "SELLER";
        }
        foundOrder.sattusUpdateDate = Date.now();
        foundOrder
          .save()
          .then(async (savedOrder) => {
            if (savedOrder) {
              ///////////////////////////////////////////
              let foundOrder = await Order.findOne({ _id: savedOrder._id })
                .populate({
                  path: "user",
                })
                .populate({
                  path: "service",
                })
                .populate({
                  path: "service",
                  populate: { path: "seller" },
                });

              //below token collection and payload prepration
              let tokensArray = [];
              let payload = {
                notification: {
                  title: `ORDER ${orderStatus}`,

                  body: `ORDER ${orderStatus + " BY " + statusChangeBy}`,
                },
                data: {
                  orderID: `${savedOrder._id}`,
                },
              };
              //working on save notifications
              let newNotification = await new Notifications({
                title: payload.notification.title,
                body: payload.notification.body,
                seller: foundOrder.service.seller._id,
                user: foundOrder.user,
                notificationFor: "USER",
                notificationType: `${orderStatus}`,
                order: savedOrder._id,
                notificationDateTime: Date.now(),
              });
              let saveNotification = newNotification.save();
              if (saveNotification) {
                console.log("Notification Saved");
              } else {
                console.log("Notification Not Saved");
              }

              if (foundOrder.user.mobileFcToken !== null) {
                tokensArray.push(foundOrder.user.mobileFcToken);
              }
              if (foundOrder.user.webFcToken !== null) {
                tokensArray.push(foundOrder.user.webFcToken);
              }
              let isSendNotification = await notificationSend(
                tokensArray,
                payload
              );
              console.log(isSendNotification);
              if (isSendNotification) {
                console.log("New Order Notification sent to Seller");
              }

              ////////////////////////////
              return res
                .json({
                  msg: `Order status= ${savedOrder.orderStatus}`,
                  savedOrder,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({
                  msg: `Order status=${foundOrder.orderStatus}`,
                  success: false,
                })
                .status(505);
            }
          })
          .catch((err) => {
            console.log(err);
            return res.json({ msg: "Failed!", success: false }).status(505);
          });
      } else {
        return res
          .json({ msg: " Order Not Found", success: false })
          .status(500);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post(
  "/auto-order-completion-after-delivery-of-three-days",
  (req, res) => {
    let date_ob = new Date();
    let dateToday = date_ob.getDate();

    Order.find({ orderStatus: "DELIVERED" })
      .then(async (foundDeliveredOrders) => {
        if (foundDeliveredOrders.length > 0) {
          for (let index = 0; index < foundDeliveredOrders.length; index++) {
            const element = foundDeliveredOrders[index];

            let orderfullDate = element.sattusUpdateDate;
            let dateOfOrder = orderfullDate.getDate();
            let subResult = dateToday - dateOfOrder;
            console.log(subResult);
            if (subResult >= 0) {
              element.orderStatus = "COMPLETED";
              let saveOrder = await element.save();
              if (saveOrder) {
                console.log(`Updated`);
                console.log(`${saveOrder}`);
              }
            }
            if (foundDeliveredOrders.length === index + 1) {
              return res
                .json({
                  msg: "All Orders Status Updated",
                  success: true,
                })
                .status(200);
            }
          }
        } else {
          return res
            .json({ msg: "Order Not FOund", success: false })
            .status(500);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "Failed", success: false }).status(500);
      });
  }
);

Router.post("/show-completed-paid-nonpaid-orders-list", (req, res) => {
  let { isPaid, paymentThrough } = req.body;
  console.log(isPaid);
  Order.find({
    orderStatus: "COMPLETED",
    isPaid: isPaid,
    paymentThrough: paymentThrough,
  })
    .populate({ path: "user" })
    .populate({ path: "service" })
    .populate({ path: "service", populate: { path: "seller" } })
    .then((foundOrder) => {
      if (foundOrder.length > 0) {
        return res
          .json({
            msg: `Completed ${isPaid ? "Paid" : "NonPaid"} Orders List`,
            totalOrders: foundOrder.length,
            foundOrder,
            success: true,
          })
          .status(200);
      } else {
        return res.json({ msg: "No Order", success: false }).status(505);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/change-payment-status", (req, res) => {
  let { orderID, isPaid } = req.body;

  if (isPaid === "") {
    return res.json({ msg: "Failed", success: false }).status(404);
  }

  Order.findOne({ _id: orderID })
    .then((foundOrder) => {
      if (foundOrder !== null) {
        foundOrder.isPaid = isPaid;
        foundOrder
          .save()
          .then((savedOrder) => {
            if (savedOrder) {
              return res
                .json({
                  msg: `Payment isPaid:${savedOrder.isPaid}`,
                  savedOrder,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({
                  msg: `Not Update`,

                  success: false,
                })
                .status(404);
            }
          })
          .catch((err) => {
            console.log(err);
            return res
              .json({ msg: "Failed save!", success: false })
              .status(505);
          });
      } else {
        return res.json({ msg: "Not Found", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

////////////////////////////////////////////////////////////////
Router.post("/show--single-order-details", (req, res) => {
  let { orderID } = req.body;
  Order.findOne({ _id: orderID })
    .populate({
      path: "user",
    })
    .populate({
      path: "service",
    })
    .populate({
      path: "service",
      populate: { path: "seller" },
    })
    .then((foundOrder) => {
      if (foundOrder !== null) {
        return res
          .json({
            msg: `Order Details`,
            foundOrder,
            success: true,
          })
          .status(202);
      } else {
        return res.json({ msg: `No Order`, success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});

Router.post("/search-top-rated-services-by-name", (req, res) => {
  const { serviceName } = req.body;

  let message = false;
  if (serviceName === "") {
    message = "Invalid serviceName";
  } else {
    message = false;
  }
  if (message === false) {
    Service.find({
      isBlock: false,
      serviceName: new RegExp(`^${serviceName}`, "i"),
    })
      .then((foundServices) => {
        if (foundServices.length > 0) {
          return res
            .json({
              msg: "Search Found",
              foundServices: foundServices,
              success: true,
            })
            .status(200);
        } else {
          console.log("Not Found");
          return res
            .json({
              msg: "Invalid!",
              success: false,
            })
            .status(400);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "catch error", success: false }).status(404);
      });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
});

////////////////////////////////////////////////////////////////
Router.post("/show-specific-service-reviews", async (req, res) => {
  let { serviceID } = req.body;
  Reviews.find({ service: serviceID })
    .populate({ path: "user" })
    .then((foundReviews) => {
      if (foundReviews.length > 0) {
        return res
          .json({ msg: "found Reviews", foundReviews, success: true })
          .status(200);
      } else {
        return res.json({ msg: "No Review", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});

////////////////////////////////////////////////////////////////
Router.post("/show-rating-of-specific-seller", async (req, res) => {
  let { sellerID } = req.body;
  let sellerRating = 0;
  let avgRatingService = 0;
  let ratingSum = 0;
  let reviewsLength = 0;
  let avgRatingAllServices = 0;

  let sumRating = 0;
  let avgSellerRating = 0;
  let count = 0;
  let foundServices = await Service.find({ seller: sellerID, isBlock: false });
  if (foundServices.length > 0) {
    for (let k = 0; k < foundServices.length; k++) {
      if (foundServices[k].avgRating !== 0) {
        count++;
        console.log("services avgRating");
        console.log(foundServices[k].avgRating);
        sumRating = foundServices[k].avgRating + sumRating;
        console.log(count);
      }
      avgSellerRating = sumRating / count;
    }
    // console.log(avgRatingAllServices);
    sellerRating = avgRatingAllServices / reviewsLength;
    // console.log("sellerRating");
    // console.log(sellerRating);

    return res
      .json({
        msg: "Seller's Average Rating on all feedbacks given by users",
        avgSellerRating,
        success: true,
      })
      .status(200);
  } else {
    return res
      .json({
        msg: "No Service",
        success: false,
      })
      .status(404);
  }
});

////////////////////////////////////////////////////////////////
Router.post("/show-all-orders-of-user-with-status", (req, res) => {
  let { userID, orderStatus } = req.body;
  Order.find({ user: userID, orderStatus: orderStatus })
    .populate({
      path: "user",
    })
    .populate({
      path: "service",
    })
    .then((foundOrders) => {
      if (foundOrders.length > 0) {
        return res
          .json({
            msg: `Orders`,
            noOfOrders: foundOrders.length,
            foundOrders,
            success: true,
          })
          .status(202);
      } else {
        return res.json({ msg: `No Order`, success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});
////////////////////////////////////////////////////////////////
Router.post("/show-all-orders-of-seller-with-status", (req, res) => {
  let { sellerID, orderStatus } = req.body;
  Service.find({ seller: sellerID, isBlock: false })
    .populate({
      path: "user",
    })
    .populate({
      path: "service",
    })
    .then((foundServices) => {
      if (foundServices.length > 0) {
        Order.find({ service: foundServices, orderStatus: orderStatus })
          .then((foundOrders) => {
            if (foundOrders.length > 0) {
              return res
                .json({
                  msg: `Orders`,
                  noOfOrders: foundOrders.length,
                  foundOrders,
                  success: true,
                })
                .status(202);
            } else {
              return res.json({ msg: `No Order`, success: false }).status(404);
            }
          })
          .catch((err) => {
            console.log(err);
            return res.json({ msg: "Failed", success: false }).status(404);
          });
      } else {
        return res.json({ msg: "No Service Of Such seller so no order" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});

////////////////////////////////////////////////////////////////
Router.post("/show-all-orders-of-seller", (req, res) => {
  let { sellerID } = req.body;
  Service.find({ seller: sellerID, isBlock: false })
    .then((foundServices) => {
      if (foundServices.length > 0) {
        Order.find({ service: foundServices })
          .populate({ path: "user" })
          .populate({ path: "service" })
          .then((foundOrders) => {
            if (foundOrders.length > 0) {
              return res
                .json({
                  msg: `Orders`,
                  noOfOrders: foundOrders.length,
                  foundOrders,
                  success: true,
                })
                .status(202);
            } else {
              return res.json({ msg: `No Order`, success: false }).status(404);
            }
          })
          .catch((err) => {
            console.log(err);
            return res.json({ msg: "Failed", success: false }).status(404);
          });
      } else {
        return res
          .json({
            msg: "No Service Of Such seller so no order!",
            success: false,
          })
          .status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(400);
    });
});

////////////////////////////////////////////////////////////////
Router.post("/show-all-orders-of-user", (req, res) => {
  let { userID } = req.body;
  Order.find({ user: userID })
    .populate({
      path: "user",
    })
    .populate({
      path: "service",
    })
    .populate({
      path: "service",
      populate: { path: "seller" },
    })
    .then((foundOrders) => {
      if (foundOrders.length > 0) {
        return res
          .json({
            msg: `Orders`,
            noOfOrders: foundOrders.length,
            foundOrders,
            success: true,
          })
          .status(202);
      } else {
        return res.json({ msg: `No Order`, success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});

////////////////////////////////////////////////////////////////
Router.post("/show-all-orders-in-system", (req, res) => {
  Order.find()
    .populate({
      path: "user",
    })
    .populate({
      path: "service",
      populate: {
        path: "seller",
      },
    })
    .then((foundOrders) => {
      if (foundOrders.length > 0) {
        return res
          .json({
            msg: `Orders`,
            noOfOrders: foundOrders.length,
            foundOrders,
            success: true,
          })
          .status(202);
      } else {
        return res.json({ msg: `No Order`, success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});

////////////////////////////////////////////////////////////////
Router.post("/show-orders-with-status", (req, res) => {
  let { orderStatus } = req.body;

  Order.find({ orderStatus: orderStatus })
    .populate({
      path: "user",
    })
    .populate({
      path: "service",
    })
    .populate({
      path: "service",
      populate: { path: "seller" },
    })
    .then((foundOrders) => {
      if (foundOrders.length > 0) {
        return res
          .json({
            msg: `${orderStatus}ED Orders`,
            noOfOrders: foundOrders.length,
            foundOrders,
            success: true,
          })
          .status(202);
      } else {
        return res.json({ msg: `No Order`, success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});
updateServicesAvgRating = async (serviceID) => {
  let foundReviews = await Reviews.find({
    service: serviceID,
  });

  if (foundReviews.length > 0) {
    console.log(foundReviews);
    let ratingSum = 0;
    let ratingAvg = 0;
    for (let i = 0; i < foundReviews.length; i++) {
      const eachReview = foundReviews[i];

      ratingSum = eachReview.rating + ratingSum;
    }
    ratingAvg = ratingSum / foundReviews.length;
    let foundService = await Service.findOne({
      _id: serviceID,
    });
    foundService.avgRating = Math.round(ratingAvg);
    let updateServieRating = await foundService.save();
    if (updateServieRating) {
      console.log("updated Service Rating");
    }
  }
  return "Updated";
};
////////////////////////////////////////////////////////////////
Router.post("/add-new-review", (req, res) => {
  let { orderID, serviceID, userID, description, rating } = req.body;

  let newReviews = new Reviews({
    order: orderID,
    service: serviceID,
    user: userID,
    description: description,
    rating: rating,
  });

  newReviews
    .save()
    .then(async (reviewSaved) => {
      if (reviewSaved) {
        let updateRating = await updateServicesAvgRating(serviceID);
        if (updateRating === "Updated") {
          return res
            .json({
              msg: "newReview Created",
              reviewSaved,
              updateRating,
              success: true,
            })
            .status(200);
        }
      } else {
        return res
          .json({ msg: "No Review Created", success: false })
          .status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});

/////////////////////////////////////////////////////////////////
Router.post("/show-orders-of-specific-user", (req, res) => {
  let { userID } = req.body;

  Order.find({ user: userID })
    .populate({
      path: "user",
    })
    .populate({
      path: "service",
    })
    .then((foundOrders) => {
      if (foundOrders.length > 0) {
        return res
          .json({ msg: "Found Orders", foundOrders, success: true })
          .status(200);
      } else {
        return res.json({ msg: "Empty", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});
////////////////////////////////////////////////////////////////
Router.post("/place-order-of-service-by-user", (req, res) => {
  let {
    serviceID,
    userID,
    description,
    price,
    day,
    time,
    extras,
    servicePrice,
    extrasPrice,
    paymentThrough,
    paymentIntent,
  } = req.body;
  let errorMessage = false;
  if (paymentThrough === "" || paymentThrough === undefined) {
    return res
      .json({ msg: "Invalid Payment Through", success: false })
      .status(505);
  }
  if (serviceID === "" || !serviceID) {
    errorMessage = "Please Select Service!";
  } else if (userID == "" || !userID) {
    errorMessage = "User id Is Missed!";
  } else if (description == "" || !description) {
    errorMessage = "Description id Is Missed!";
  } else if (price == "" || !price) {
    errorMessage = "Price Is Missed!";
  } else if (day == "" || !day) {
    errorMessage = "Please Select Day For Service!";
  } else if (time == "" || !time) {
    errorMessage = "Please Select Time For Service!";
  } else {
    errorMessage = false;
  }

  if (errorMessage === false) {
    let newOrder = new Order({
      service: serviceID,
      user: userID,
      description: description,
      price: price,
      reqDay: day,
      reqTime: time,
      paymentThrough: paymentThrough,
    });
    if (paymentIntent !== undefined) {
      // newOrder._id = _id;
      newOrder.paymentIntent = paymentIntent;
    }
    if (extrasPrice) {
      newOrder.extrasPrice = extrasPrice;
    }
    if (servicePrice) {
      newOrder.servicePrice = servicePrice;
    }
    if (extras) {
      newOrder.extras = extras;
    }

    newOrder
      .save()
      .then(async (orderSaved) => {
        if (orderSaved) {
          let foundOrder = await Order.findOne({ _id: orderSaved._id })
            .populate({
              path: "user",
            })
            .populate({
              path: "service",
            })
            .populate({
              path: "service",
              populate: { path: "seller" },
            });
          //below token collection and payload prepration
          let tokensArray = [];
          let payload = {
            notification: {
              title: "Service Hired!",

              body: `Service Has Been Hired`,
            },
            data: {
              orderID: `${orderSaved._id}`,
            },
          };
          //working on save notifications
          let newNotification = await new Notifications({
            title: payload.notification.title,
            body: payload.notification.body,
            seller: foundOrder.service.seller._id,
            user: foundOrder.user,
            notificationFor: "USER",
            notificationType: "NEW_ORDER",
            order: orderSaved._id,
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
            console.log("New Order Notification sent to Seller");
          }
          return res
            .json({
              msg: "Order Created",
              orderSaved: foundOrder,
              chk: tokensArray,
              success: true,
            })
            .status(200);
        } else {
          return res
            .json({ msg: "Order Not Created", success: false })
            .status(404);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "Failed", success: false }).status(404);
      });
  } else {
    return res.json({ msg: errorMessage, success: false }).status(400);
  }
});

module.exports = Router;
