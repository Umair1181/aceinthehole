const Router = require("express").Router();
const {
  TermsAndCondition,
  Seller,
  Service,
  Order,
  ServiceCategory,
  User,
} = require("../../MODELS");

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
            for (let k = 0; k < foundOrders.length; k++) {
              priceSum = foundOrders[k].price + priceSum;
            }
            // let obj = { category: categoryID, earning: priceSum };
            // await details.push(obj);
          }
          // })
        }
        return res
          .json({
            msg: "show-earning-of-seller-in-given-duration",
            earning: priceSum,
            success: true,
          })
          .status(200);
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

Router.post("/admin-can-block-unblock-any-service", (req, res) => {
  let { serviceID, isBlock } = req.body;

  Service.findOne({ _id: serviceID })
    .then((foundservice) => {
      if (foundservice !== null) {
        foundservice.isBlock = isBlock;

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

  Seller.findOne({ _id: sellerID })
    .then((foundSeller) => {
      if (foundSeller !== null) {
        foundSeller.isBlock = isBlock;

        foundSeller
          .save()
          .then((savedSeller) => {
            if (savedSeller) {
              return res
                .json({
                  msg: `Seller is ${
                    savedSeller.isBlock ? "Seller Blocked" : "Seller Unblocked"
                  }`,
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
