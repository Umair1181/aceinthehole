const Router = require("express").Router();
const {
  TermsAndCondition,
  Seller,
  Service,
  Order,
  ServiceCategory,
  User,
  Notifications,
} = require("../../MODELS");
const notificationSend = require("../NOTIFICATIONS/notifyConfig");

Router.post("/admin-can-block-unblock-any-service", (req, res) => {
  let { serviceID, isBlock } = req.body;

  if (serviceID === null && serviceID === undefined && serviceID === "null") {
    return res.json({ msg: "Invalid Service id", success: false });
  }
  if (isBlock === null && isBlock === undefined && isBlock === "null") {
    return res.json({ msg: "Invalid isBlock", success: false });
  }
  Service.findOne({ _id: serviceID })
    .populate({ path: "seller" })
    .then(async (foundservice) => {
      if (foundservice !== null) {
        foundservice.isBlock = isBlock;
        //////////////////////////////////////

        let tokensArray = [];
        let payload = {
          notification: {
            title: `Service blocked`,
            body: `${foundservice.serviceName} is Blocked`,
          },
          data: {
            serviceID: `${serviceID}`,
          },
        };
        //working on save notifications
        let newNotification = await new Notifications({
          title: payload.notification.title,
          body: payload.notification.body,
          service: serviceID,
          // user: foundservice.user,
          notificationFor: "SELLER",
          notificationType: `BLOCKSERVICE`,
          // order: savedOrder._id,
          notificationDateTime: Date.now(),
        });
        let saveNotification = newNotification.save();
        if (saveNotification) {
          console.log("Notification Saved");
        } else {
          console.log("Notification Not Saved");
        }

        if (foundservice.seller.mobileFcToken !== null) {
          tokensArray.push(foundservice.seller.mobileFcToken);
        }
        if (foundservice.seller.webFcToken !== null) {
          tokensArray.push(foundservice.seller.webFcToken);
        }
        if (tokensArray.length > 0) {
          let isSendNotification = await notificationSend(tokensArray, payload);
          console.log(isSendNotification);
          if (isSendNotification) {
            console.log("Notification sent to Seller");
          }
        }
        ////////////////////////////////////////
        foundservice
          .save()
          .then((savedservice) => {
            if (savedservice) {
              return res
                .json({
                  msg: `service ${
                    savedservice.isBlock ? "Blocked" : "NotBlock"
                  }`,
                  savedservice,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({
                  msg: `Not Save`,

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

const getweeklyDates = (month, startDays, endDays, res) => {
  let startDate = new Date().setMonth(month - 1);
  if (endDays === "addMonth") {
    month = month;
  } else {
    month = month - 1;
  }
  let endDate = new Date().setMonth(month);

  let startDateHours = new Date(startDate).setUTCHours(0, 0, 0, 0, 0);
  let endDateHours = new Date(endDate).setUTCHours(0, 0, 0, 0, 0);

  let startDateDay = new Date(startDateHours).setDate(startDays);
  if (endDays === "addMonth") {
    endDays = 1;
  }
  let endDateDay = new Date(endDateHours).setDate(endDays);

  let finalStartDateDay = new Date(startDateDay);
  let finalEndDateDay = new Date(endDateDay);

  let IsoStartDate = finalStartDateDay.toISOString();
  let IsoEndDate = finalEndDateDay.toISOString();

  return { IsoStartDate, IsoEndDate };
};
Router.post("/services-of-specific-conditions", (req, res) => {
  let { isBlock, isLive } = req.body;
  Service.find({
    isBlock: isBlock,
    isLive: isLive,
  })
    .populate({ path: "seller" })
    .then((foundService) => {
      if (foundService.length > 0) {
        return res
          .json({
            msg: "all-services-of-specific-category-admin",
            foundService: foundService,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "No Service Found!",
            success: false,
          })
          .status(400);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});
Router.post("/show-all-services-of-specific-category-admin", (req, res) => {
  let { categoryID } = req.body;
  // Service.find({ category: categoryID, isBlock: false, isLive: true })
  Service.find({ category: categoryID })
    .populate({ path: "seller" })
    .then((foundService) => {
      if (foundService.length > 0) {
        return res
          .json({
            msg: "all-services-of-specific-category-admin",
            foundService: foundService,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "No Service Found!",
            success: false,
          })
          .status(400);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/weekly-sales-report", async (req, res) => {
  const { month, weekStart, weekEnd } = req.body;
  let ordersList = [];
  for (let index = weekStart; index <= weekEnd; index++) {
    let startDays = 1;
    let endDays = 8;
    if (index === 1) {
      startDays = 1;
      endDays = 8;
    } else if (index === 2) {
      startDays = 8;
      endDays = 15;
    } else if (index === 3) {
      startDays = 15;
      endDays = 22;
    } else if (index === 4) {
      startDays = 22;
      endDays = "addMonth";
    }

    let dates = await getweeklyDates(month, startDays, endDays, res);
    let foundMonthOrders = await Order.find({
      orderRcvDate: { $gte: dates.IsoStartDate },
      orderRcvDate: { $lt: dates.IsoEndDate },
    });
    await ordersList.push({ week: index, orders: foundMonthOrders });

    if (index === weekEnd) {
      return res
        .json({ msg: "weekly sale", ordersList, success: true })
        .success(200);
    }
  }
});
const getDates = (month) => {
  let startDate = new Date().setMonth(month - 1);
  let endDate = new Date().setMonth(month);

  let startDateHours = new Date(startDate).setUTCHours(0, 0, 0, 0, 0);
  let endDateHours = new Date(endDate).setUTCHours(0, 0, 0, 0, 0);

  let startDateDay = new Date(startDateHours).setDate(1);
  let endDateDay = new Date(endDateHours).setDate(1);

  let finalStartDateDay = new Date(startDateDay);
  let finalEndDateDay = new Date(endDateDay);

  let IsoStartDate = finalStartDateDay.toISOString();
  let IsoEndDate = finalEndDateDay.toISOString();

  return { IsoStartDate, IsoEndDate };
};

Router.post("/monthly-sales-report", async (req, res) => {
  //   //////////by umair bhi////////////////

  //   const { startMonth, endMonth } = req.body;
  //   let ordersList = [];
  // for (let index = startMonth; index <= endMonth ; index++) {
  //   let dates = await getDates( index );
  //   let foundMonthOrders = await Order.find({
  //     orderRcvDate: { $gte : dates.IsoStartDate },
  //     orderRcvDate: { $lt : dates.IsoEndDate  }
  //   });

  //   await ordersList.push({
  //     month: index,
  //     orders: foundMonthOrders
  //   });
  //   if( index === endMonth ){
  //     return res.json ({ msg: "orders List", ordersList }).status( 200 );
  //   }
  // }

  //////////////////////
  let anualReport = [];
  let totalOrder = 0;
  for (let month = 1; month <= 12; month++) {
    let startDate = new Date().setMonth(month - 1);
    let endDate = new Date().setMonth(month);
    let foundOrders = await Order.find({
      orderStatus: "COMPLETED",
      orderRcvDate: { $gte: startDate, $lt: endDate },
    });
    let calculate = 0;
    for (let i = 0; i < foundOrders.length; i++) {
      console.log(foundOrders[i].orderRcvDate);
      calculate = foundOrders[i].price + calculate;
    }
    anualReport.push({
      monthNo: month,
      totalOrders: foundOrders.length,
      totalSale: calculate,
    });
    // totalOrder = foundOrders.length;
  }
  return res
    .json({
      msg: "Anuual Month wise Revenue Report ",
      anualReport,
      ordersInMonth: totalOrder,
      success: true,
    })
    .status(200);
});

Router.post("/show-earning-of-seller-in-given-duration", (req, res) => {
  let { sellerID, startDate, endDate } = req.body;
  let priceSum = 0;
  Service.find({ seller: sellerID })
    .then(async (foundServices) => {
      if (foundServices.length > 0) {
        let details = [];
        for (let i = 0; i < foundServices.length; i++) {
          // console.log(foundServices[i]._id);
          let sDate = "2020-04-30";
          let eDate = "2020-05-12";
          let foundOrders = await Order.find({
            service: foundServices[i]._id,
            orderRcvDate: {
              // orderStatus: "COMPLETED",
              $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
              $lt: new Date(new Date(endDate).setHours(23, 59, 59)),
            },
            orderStatus: "COMPLETED",
          });
          console.log("**********foundOrders");
          console.log(foundOrders);
          if (foundOrders.length > 0) {
            console.log("**********length");

            for (let k = 0; k < foundOrders.length; k++) {
              priceSum = foundOrders[k].price + priceSum;
            }
            // let obj = { category: categoryID, earning: priceSum };
            // await details.push(obj);
          }
          // })
        }
        if (priceSum === 0) {
          return res
            .json({
              msg: "No Order of seller on his any service",
              success: false,
            })
            .status(200);
        } else {
          return res
            .json({
              msg: "show-earning-of-seller-in-given-duration",
              earning: priceSum,
              success: true,
            })
            .status(200);
        }
      } else {
        return res.json({ msg: "No service", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/admin-stats", async (req, res) => {
  let sumOfPrice = 0;
  let allOrders = await Order.find({});
  let allsellers = await Seller.find();
  let allUsers = await User.find();
  let newSellers = await Seller.find({ sellerStatus: "NEWSELLER" });
  for (let k = 0; k < allOrders.length; k++) {
    sumOfPrice = sumOfPrice + allOrders[k].price;
  }

  return res
    .json({
      msg: "STATS",
      totalOrders: allOrders.length,
      totalSellers: allsellers.length,
      totalUsers: allUsers.length,
      totalNewSellers: newSellers.length,
      totalSYSSales: sumOfPrice,

      success: true,
    })
    .status(202);
});

Router.post("/show-earning-against-all-categories", async (req, res) => {
  let foundCategories = await ServiceCategory.find();
  let details = [];

  let priceSum = 0;
  if (foundCategories.length > 0) {
    for (let l = 0; l < foundCategories.length; l++) {
      let foundServices = await Service.find({
        category: foundCategories[l]._id,
      });
      if (foundServices.length > 0) {
        for (let i = 0; i < foundServices.length; i++) {
          let foundOrders = await Order.find({
            service: foundServices[i]._id,

            orderStatus: "COMPLETED",
          });
          if (foundOrders.length > 0) {
            for (let k = 0; k < foundOrders.length; k++) {
              priceSum = foundOrders[k].price + priceSum;
            }
          }
        }
      }
      await details.push({
        category: foundCategories[l],
        earning: priceSum,
      });
    }
    return res
      .json({
        msg: "Earning against given category",
        totalCategories: foundCategories.length,

        details,
        success: true,
      })
      .status(200);
  } else {
    return res.json({ msg: "No service Category", success: false }).status(505);
  }
  // })
  // .catch((err) => {
  //   console.log(err);
  //   return res.json({ msg: "Failed!", success: false }).status(505);
  // });
});

Router.post("/show-earning-against-category", (req, res) => {
  let { categoryID } = req.body;

  Service.find({ category: categoryID })
    .then(async (foundServices) => {
      if (foundServices.length > 0) {
        let details = [];
        for (let i = 0; i < foundServices.length; i++) {
          console.log(foundServices[i]._id);
          let foundOrders = await Order.find({
            service: foundServices[i]._id,
            orderStatus: "COMPLETED",
          });
          // .then((foundOrders) => {
          // return res.json({ msg: "Failed!", foundOrders }).status(505);
          if (foundOrders.length > 0) {
            let priceSum = 0;
            for (let k = 0; k < foundOrders.length; k++) {
              priceSum = foundOrders[k].price + priceSum;
              console.log("priceSum");
              console.log(priceSum);
            }
            let obj = { category: categoryID, earning: priceSum };
            await details.push(obj);
          }
          // })
        }
        return res
          .json({
            msg: "Earning against given category",
            details,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({ msg: "No service against this category", success: false })
          .status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/total-sales-in-given-duration", (req, res) => {
  let { startDate, endDate } = req.body;
  let sDate = "2020-04-30";
  let eDate = "2020-05-12";
  Order.find({
    reqDay: {
      $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
      $lte: new Date(new Date(endDate).setHours(23, 59, 59)),
    },
  })
    .then((foundOrders) => {
      if (foundOrders.length > 0) {
        let sumOfPrice = 0;
        for (let k = 0; k < foundOrders.length; k++) {
          console.log(foundOrders[k].price);
          sumOfPrice = sumOfPrice + foundOrders[k].price;
        }
        return res
          .json({
            msg: "total-sales-in-given-duration",
            totalOrders: foundOrders.length,
            totalSales: sumOfPrice,

            success: true,
          })
          .status(202);
      } else {
        return res
          .json({
            msg: "No Order",
            success: false,
          })
          .status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/number-of-orders-in-given-duration", (req, res) => {
  let { startDate, endDate } = req.body;
  let sDate = "2020-04-30";
  let eDate = "2020-05-12";
  Order.find({
    reqDay: {
      $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
      $lte: new Date(new Date(endDate).setHours(23, 59, 59)),
    },
  })
    .then((foundOrders) => {
      if (foundOrders.length > 0) {
        return res
          .json({
            msg: "Total Orders in given duration",
            result: foundOrders.length,

            success: true,
          })
          .status(202);
      } else {
        return res
          .json({
            msg: "No Order",
            success: false,
          })
          .status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/admin-can-approve-disapprove-new-service", (req, res) => {
  let { serviceID, serviceStatus } = req.body;

  Service.findOne({ _id: serviceID })
    .then((foundservice) => {
      if (foundservice !== null) {
        foundservice.serviceStatus = serviceStatus;

        foundservice
          .save()
          .then((savedservice) => {
            if (savedservice) {
              return res
                .json({
                  msg: `service is ${savedservice.serviceStatus}`,
                  savedservice,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({
                  msg: `service Not Save`,

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

Router.post("/show-blocked-sellers-list", (req, res) => {
  Seller.find({ isBlock: true })
    .then((foundSellers) => {
      console.log(foundSellers);
      if (foundSellers.length > 0) {
        return res
          .json({
            msg: "blocked-sellers-list",
            foundSellers,
            success: true,
          })
          .status(200);
      } else {
        return res.json({ msg: "Empty", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/show-rejected-sellers-list", (req, res) => {
  Seller.find({ sellerStatus: "REJECT" })
    .then((foundSellers) => {
      console.log(foundSellers);
      if (foundSellers.length > 0) {
        return res
          .json({
            msg: "rejected-sellers-list",
            foundSellers,
            success: true,
          })
          .status(200);
      } else {
        return res.json({ msg: "Empty", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/show-accepted-sellers-list", (req, res) => {
  Seller.find({ sellerStatus: "ACCEPT" })
    .then((foundSellers) => {
      console.log(foundSellers);
      if (foundSellers.length > 0) {
        return res
          .json({
            msg: "accepted-sellers-list",
            foundSellers,
            success: true,
          })
          .status(200);
      } else {
        return res.json({ msg: "Empty", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/show-requested-sellers-list", (req, res) => {
  Seller.find({ sellerStatus: "NEWSELLER" })
    .then((foundNewSellers) => {
      console.log(foundNewSellers);
      if (foundNewSellers.length > 0) {
        return res
          .json({
            msg: "New Requested Sellers",
            foundNewSellers,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({ msg: "No Requested Sellers", success: false })
          .status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/admin-can-block-unblock-any-seller", (req, res) => {
  let { sellerID, isBlock } = req.body;
  if (sellerID === null && sellerID === undefined && sellerID === "null") {
    return res.json({ msg: "Invalid sellerID", success: false });
  }
  if (isBlock === null && isBlock === undefined && isBlock === "null") {
    return res.json({ msg: "Invalid isBlock", success: false });
  }
  Seller.findOne({ _id: sellerID })
    .then((foundSeller) => {
      if (foundSeller !== null) {
        foundSeller.isBlock = isBlock;

        foundSeller
          .save()
          .then(async (savedSeller) => {
            if (savedSeller) {
              let foundServices = await Service.find({
                seller: savedSeller._id,
                isBlock: false,
              });
              let foundOrders = await Order.find({
                service: foundServices,
                // isPaid: true,
                orderStatus: [
                  "NEWORDER",
                  "DELIVERED",
                  "DISPUTE",
                  // "ORDERCANCELED",
                  //"COMPLETED",
                ],
              });
              console.log("***foundOrders.length");
              console.log(foundOrders.length);
              if (foundOrders.length > 0) {
                savedSeller.isOrderBlocked = false;
              } else {
                savedSeller.isOrderBlocked = true;
              }
              let saveSellerAgain = await savedSeller.save();
              return res
                .json({
                  msg: `Seller is ${
                    savedSeller.isBlock ? "Seller Blocked" : "Seller Unblocked"
                  }`,
                  savedSeller: saveSellerAgain,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({
                  msg: `Seller Not Save`,

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

Router.post("/admin-can-accept-reject-newseller", (req, res) => {
  let { sellerID, sellerstatus } = req.body;

  Seller.findOne({ _id: sellerID })
    .then((foundSeller) => {
      if (foundSeller !== null) {
        foundSeller.sellerStatus = sellerstatus;

        foundSeller
          .save()
          .then((savedSeller) => {
            if (savedSeller) {
              return res
                .json({
                  msg: `Seller is ${savedSeller.sellerStatus}`,
                  savedSeller,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({
                  msg: `Seller Not Save`,

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

Router.post(
  "/delete-specific-terms-and-condition-against-id",
  async (req, res) => {
    let { _id } = req.body;
    let foundTermsAndConditions = await TermsAndCondition.remove({
      _id: _id,
    });
    if (foundTermsAndConditions.n === 1) {
      return res
        .json({
          msg: `TermsAndCondition Removed`,
          deletedTandC: _id,
          success: true,
        })
        .status(200);
    } else {
      return res.json({ msg: "Invalid!", success: false }).status(400);
    }
  }
);

/////////////////////////////////////////////
Router.post("/add-new-terms-and-condition", async (req, res) => {
  let { termsAndCondition, isSellerOrUser } = req.body;
  let message = false;
  if (termsAndCondition === "") {
    message = "Invalid termsAndCondition";
  } else if (isSellerOrUser === "") {
    message = "Invalid isSellerOrUser";
  }
  if (message === false) {
    let newTermsAndCondition = new TermsAndCondition({
      termsAndCondition: termsAndCondition,
      isSellerOrUser: isSellerOrUser,
    });
    let savedTermsAndCondition = await newTermsAndCondition.save();
    if (savedTermsAndCondition) {
      return res
        .json({
          msg: `New Terms and Cndition Added for ${
            isSellerOrUser ? "Seller" : "Buyer"
          }`,
          savedTermsAndCondition: savedTermsAndCondition,
          success: true,
        })
        .status(200);
    } else {
      return res.json({ msg: "Value is Saved", success: false }).status(400);
    }
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
});
/////////////////////////////////////////////
Router.post("/show-specific-terms-and-condition", async (req, res) => {
  let { _id } = req.body;
  let foundTermsAndConditions = await TermsAndCondition.findOne({
    _id: _id,
  });
  if (foundTermsAndConditions !== null) {
    return res
      .json({
        msg: `TermsAndCondition`,
        foundTAndC: foundTermsAndConditions,
        success: true,
      })
      .status(200);
  } else {
    return res.json({ msg: "Not Found!", success: false }).status(400);
  }
});

/////////////////////////////////////////////
Router.post("/show-terms-and-conditions", async (req, res) => {
  let { isSellerOrUser } = req.body;
  let foundTermsAndConditions = await TermsAndCondition.find({
    isSellerOrUser: isSellerOrUser,
  });
  if (foundTermsAndConditions.length > 0) {
    return res
      .json({
        msg: `${isSellerOrUser ? "Seller's" : "Buyer's"} TermsAndConditions`,
        foundTAndC: foundTermsAndConditions,
        success: true,
      })
      .status(200);
  } else {
    return res.json({ msg: "Not Found!", success: false }).status(400);
  }
});

module.exports = Router;
