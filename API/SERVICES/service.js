const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const {
  Service,
  ServiceCategory,
  Reviews,
  Order,
  Seller,
  User,
} = require("../../MODELS");
const notificationSend = require("../NOTIFICATIONS/notifyConfig");
const { upload, CreateURL } = require("../../storage")();
// const deleteImg = require("../FIES/imageAPI");
const { COMPLETED, DISPUTE, ORDERCANCELED } = require("../ORDER/orderStatus");
const ServiceClass = require("../BusinessLogics/service");
const ServiceRating = require("../BusinessLogics/rating");

//  calculateServiceRat(sellerID) {
//   let sumation = 0;
//   let foundServices = await Service.find({ seller: sellerID })
//     .populate({
//       path: "seller",
//     })
//     .populate({
//       path: "category",
//     });
//   for (let i = 0; i < foundServices.length; i++) {
//     let foundReviews = await Reviews.find({ service: foundServices[i]._id });
//     console.log("************************************");
//     console.log(foundReviews);
//     let avg = 0;
//     // .then((foundReviews) => {
//     if (foundReviews.length > 0) {
//       for (let k = 0; k < foundReviews.length; k++) {
//         sumation = sumation + foundReviews[k].rating;
//       }
//       avg = sumation / foundReviews.length;
//       // this.avgRating.push(avg);
//     } else {
//       console.log("no rating of this service");
//     }
//     console.log("Befor Round Off");
//     console.log(avg);
//     console.log("After Round Off");
//     console.log(Math.round(avg));
//     foundServices[i].avgRating = Math.round(avg);
//     let savedRating = await foundServices[i].save();
//     console.log("savedRating");
//     console.log(savedRating);
//     // })
//   }

//   return foundServices;
// }

Router.post("/show-most-hired-services-top-fifteen", async (req, res) => {
  let { location } = req.body;
  let allTopServices = [];
  if (location === "" || location === undefined) {
    message = "Invalid location!";
  } else {
    message = false;
  }
  if (message === false) {
    let topServices = await Order.aggregate([
      {
        $group: {
          _id: "$service",
          count: { $sum: 1 },
        },
      },
    ]).limit(10);

    Service.populate(topServices, {
      path: "_id",
      populate: { path: "seller" },
    }).then(async (topServices) => {
      if (topServices.length < 1) {
        return res
          .json({ msg: "No Service Ordered Yet!", success: false })
          .status(200);
      } else {
        console.log(topServices.length);
        for (let index = 0; index < topServices.length; index++) {
          console.log("Lopp");
          // const sellerLongitude =
          //   topServices[index]._id.seller.location.longitude;
          // const sellerLatitude =
          //   topServices[index]._id.seller.location.latitude;
          // console.log(`location latitude ${location.latitude}`);
          // console.log(`location longitude ${location.longitude}`);
          // console.log(`sellerLongitude ${sellerLongitude}`);
          // console.log(`sellerLatitude ${sellerLatitude}`);
          //current location coordinates
          let latitude2 = location.latitude;
          let longitude2 = location.longitude;
          //each seller coordinates
          let latitude1 = topServices[index]._id.seller.location.latitude;
          let longitude1 = topServices[index]._id.seller.location.longitude;
          var p = 0.017453292519943295; //This is  Math.PI / 180
          var c = Math.cos;

          var a =
            0.5 -
            c((latitude2 - latitude1) * p) / 2 +
            (c(latitude1 * p) *
              c(latitude2 * p) *
              (1 - c((longitude2 - longitude1) * p))) /
              2;
          var R = 6371; //  Earth distance in km so it will return the distance in km
          var distance = 2 * R * Math.asin(Math.sqrt(a));

          console.log("step 1");
          console.log(distance);
          if (distance <= 100) {
            console.log("step 2");
            await allTopServices.push(topServices[index]._id);
          }
          let allServicesArray = [];
          if (topServices.length === index + 1) {
            if (allTopServices.length > 0) {
              for (let k = 0; k < allTopServices.length; k++) {
                for (let j = 0; j < allTopServices[k].length; j++) {
                  // const element = array[j];
                  console.log(allTopServices[k][j]);
                  await allServicesArray.push(allTopServices[k][j]);
                }
              }

              return res
                .json({
                  msg: "Top Ten Most Hired Services in Your Area!",
                  // demo: topServices[0]._id.seller.location,
                  topServices: allServicesArray,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({ msg: "No Nearest Service", success: false })
                .status(500);
            }
          }
        }
        // return res
        //   .json({
        //     msg: "Top Ten Most Hired Services!",
        //     // demo: topServices[0]._id.seller.location,
        //     topServices: allTopServices,
        //     success: true,
        //   })
        //   .status(200);
      }
    });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
});
const getServicesOfNearesSellersSpecificCategory = async (
  SellersList,
  categoryID,
  latitude2,
  longitude2
) => {
  // let allSellersIDs = [];
  let allServices = [];
  for (let x = 0; x < SellersList.length; x++) {
    // 31.472472, 73.131969
    //31.433812, 73.111198
    let latitude1 = SellersList[x].location.latitude;
    let longitude1 = SellersList[x].location.longitude;
    var p = 0.017453292519943295; //This is  Math.PI / 180
    var c = Math.cos;

    var a =
      0.5 -
      c((latitude2 - latitude1) * p) / 2 +
      (c(latitude1 * p) *
        c(latitude2 * p) *
        (1 - c((longitude2 - longitude1) * p))) /
        2;
    var R = 6371; //  Earth distance in km so it will return the distance in km
    var distance = 2 * R * Math.asin(Math.sqrt(a));
    // console.log("distance of one buyer to its all nearest sellers");
    // console.log(distance);
    // let findCoustomValue = await coustomAdmin.find();
    // if (distance <= findCoustomValue[0].locationRadius) {
    if (distance <= 100) {
      console.log(SellersList[x]._id);
      let founServices = await Service.find({
        seller: SellersList[x]._id,
        category: categoryID,
        isBlock: false,
        isLive: true,
      }).populate({ path: "seller" });
      // let obj = {
      //   dist: distance,
      //   sellerID: SellersList[x]._id,
      // };
      console.log("*****************************");
      console.log(founServices);
      console.log("*****************************");
      if (founServices.length > 0) {
        allServices.push(founServices);
      }
      if (x + 1 === SellersList.length) {
        return allServices;
        // let SortedSellers = await sortBulkStageDforList(allSellersDists);
        // for (let k = 0; k < SortedSellers.length; k++) {
        //   allSellersIDs.push(SortedSellers[k].sellerID);
        //   if (SortedSellers.length == k + 1) {
        //     // let foundBuyer = await Buyer.findOne({ _id: buyerID });
        //     // console.log("foundBuyer");
        //     // console.log(foundBuyer);
        //     // foundBuyer.nearesTenSellers = allSellersIDs;
        //     // let updateBuyer = await foundBuyer.save();
        //     // if (updateBuyer !== null) {
        //     let ssSeller = await Seller.find({ _id: allSellersIDs });
        //     return ssSeller;
        //     // } else {
        //     //   return false;
        //     // }
        //   }
        // }
      }
    }
  }
};
Router.post("/show-all-services-of-specific-category", async (req, res) => {
  let { location, userID, categoryID } = req.body;
  let message = false;
  if (location.longitude === "") {
    message = "Invalid Longitude!";
  } else if (location.latitude === "") {
    message = "Invalid latitude!";
  } else if (userID === "") {
    message = "Invalid userID!";
  } else if (categoryID === "") {
    message = "Invalid categoryID!";
  } else {
    message = false;
  }
  if (message === false) {
    let SellersList = await Seller.find().populate({ path: "seller" });
    if (SellersList.length > 0) {
      let bLo = location.longitude;
      let bLa = location.latitude;
      let allServices = await getServicesOfNearesSellersSpecificCategory(
        SellersList,
        categoryID,
        bLa,
        bLo
      );
      if (allServices !== false) {
        console.log("allServices");
        console.log(allServices);
        if (allServices.length > 0) {
          let allServicesArray = [];
          for (let k = 0; k < allServices.length; k++) {
            for (let j = 0; j < allServices[k].length; j++) {
              // const element = array[j];
              console.log(allServices[k][j]);
              await allServicesArray.push(allServices[k][j]);
            }
          }
          await new ServiceClass()
            .checkServiceinWishList(allServicesArray, userID)
            .then(async (allServicesArr) => {
              if (allServicesArr.length > 0) {
                return res
                  .json({
                    msg: "all-services-of-specific-category-with-cart-status",
                    foundService: allServicesArr,
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

          // return res
          //   .json({
          //     msg: "Services Of Nearest  Sellers",
          //     services: allServices,
          //     success: true,
          //   })
          //   .status(200);
        } else {
          return res
            .json({ msg: "No Nearest Seller", success: false })
            .status(505);
        }
      } else if (allServices === "Not Found!") {
        return res.json({ msg: "Not Found", success: false }).status(400);
      } else {
        return res.json({ msg: "Failed!", success: false }).status(400);
      }
    } else {
      return res.json({ msg: "No Seller Exist", success: false }).status(400);
    }
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
});

Router.post("/update-service-or-certificate-images-in-json", (req, res) => {
  let { _id, images, isServiceOrCertificateImg } = req.body;
  Service.findOne({ _id: _id })
    .then(async (foundService) => {
      if (foundService !== null) {
        if (isServiceOrCertificateImg === true) {
          foundService.serviceImgsURLs = images;
        } else {
          foundService.certificatesImgsURLs = images;
        }

        let savedService = await foundService.save();
        if (savedService) {
          return res
            .json({ msg: "Images Updated", savedService, success: true })
            .status(200);
        } else {
          return res
            .json({ msg: "Images Not Updated", success: false })
            .status(500);
        }
      } else {
        return res
          .json({ msg: "Service Not Found", success: false })
          .status(400);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", err, success: false }).status(500);
    });
});

Router.post("/show-all-services", async (req, res) => {
  let { userID, location } = req.body;
  let message = false;
  if (
    location === "" &&
    location.longitude === "" &&
    location.longitude === null &&
    location.longitude === undefined
  ) {
    message = "Invalid Longitude!";
  } else if (
    location === "" &&
    location.latitude === "" &&
    location.latitude === null &&
    location.latitude === undefined
  ) {
    message = "Invalid latitude!";
  } else if (
    location.userID === "" &&
    location.userID === null &&
    location.userID === undefined
  ) {
    message = "Invalid userID!";
  } else {
    message = false;
  }
  if (message === false) {
    let foundUser = await User.findOne({ _id: userID });
    if (foundUser !== null) {
      ////////////////////////
      let SellersList = await Seller.find().populate({ path: "seller" });
      if (SellersList.length > 0) {
        let bLo = location.longitude;
        let bLa = location.latitude;
        console.log(SellersList);
        let allServices = await getServicesOfNearesSellers(
          SellersList,
          userID,
          bLa,
          bLo
        );
        console.log(allServices);
        // return res.json(allServices);
        if (allServices !== false && allServices !== undefined) {
          // console.log("allServices");
          // console.log(allServices);
          if (allServices.length > 0) {
            let allServicesArray = [];
            for (let k = 0; k < allServices.length; k++) {
              for (let j = 0; j < allServices[k].length; j++) {
                await allServicesArray.push(allServices[k][j]);
              }
            }
            // return res.json(allServices);
            await new ServiceClass()
              .checkServiceinWishList(allServicesArray, userID)
              .then(async (servicesWithStatus) => {
                if (servicesWithStatus.length > 0) {
                  // let allServicesArray = [];
                  // for (let k = 0; k < servicesWithStatus.length; k++) {
                  //   for (let j = 0; j < servicesWithStatus[k].length; j++) {
                  //     await allServicesArray.push(servicesWithStatus[k][j]);
                  //   }
                  // }

                  return res
                    .json({
                      msg:
                        "All Nearest Seller Services with status of in wishlist!",
                      foundServices: servicesWithStatus,
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
            // return res
            //   .json({
            //     msg: "Services Of Nearest  Sellers",
            //     services: allServices,
            //     success: true,
            //   })
            //   .status(200);
          } else {
            return res
              .json({ msg: "No Nearest Seller", success: false })
              .status(505);
          }
        } else if (allServices === "Not Found!") {
          return res.json({ msg: "Not Found", success: false }).status(400);
        } else {
          return res.json({ msg: "No Service", success: false }).status(400);
        }
      } else {
        return res.json({ msg: "No Seller Exist", success: false }).status(400);
      }
    } else {
      return res.json({ msg: "User Not Exist", success: false });
    }

    /////////////////
    // Service.find({ isBlock: false, isLive: true })
    //   .populate({ path: "seller" })
    //   .populate({ path: "category" })
    //   .then(async (foundServices) => {
    //     await new ServiceClass()
    //       .checkServiceinWishList(foundServices, userID)
    //       .then((servicesWithStatus) => {
    //         if (servicesWithStatus.length > 0) {
    //           return res
    //             .json({
    //               msg: "All Services with status of in cart!",
    //               foundServices: servicesWithStatus,
    //               success: true,
    //             })
    //             .status(200);
    //         } else {
    //           return res
    //             .json({
    //               msg: "No Service Found!",
    //               success: false,
    //             })
    //             .status(400);
    //         }
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         return res.json({ msg: "Failed!", success: false }).status(505);
    //       });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return res.json({ msg: "Failed!", success: false }).status(505);
    //   });
  } else {
    return res.json({ msg: message, success: false }).status(500);
  }
});

const getServicesOfNearesSellers = async (
  SellersList,
  buyerID,
  latitude2,
  longitude2
) => {
  let allServices = [];
  for (let x = 0; x < SellersList.length; x++) {
    // 31.472472, 73.131969
    //31.433812, 73.111198
    let latitude1 = SellersList[x].location.latitude;
    let longitude1 = SellersList[x].location.longitude;

    var p = 0.017453292519943295; //This is  Math.PI / 180
    var c = Math.cos;
    var a =
      0.5 -
      c((latitude2 - latitude1) * p) / 2 +
      (c(latitude1 * p) *
        c(latitude2 * p) *
        (1 - c((longitude2 - longitude1) * p))) /
        2;
    var R = 6371; //  Earth distance in km so it will return the distance in km
    var distance = 2 * R * Math.asin(Math.sqrt(a));
    if (distance <= 100) {
      let founServices = await Service.find({
        isBlock: false,
        seller: SellersList[x]._id,
        isLive: true,
      }).populate({ path: "seller" });
      console.log("founServices");
      console.log(founServices);
      if (founServices.length > 0) {
        await allServices.push(founServices);
      }
    }
    if (x + 1 === SellersList.length) {
      console.log(SellersList.length);
      return allServices;
    }
  }
};
Router.post("/show-most-hired-services-top-fifteen", async (req, res) => {
  let { userID } = req.body;
  // Service.find({ isBlock: false, isLive: true })
  //   // .distinct("_id")
  //   .then((foundService) => {
  //     new ServiceClass()
  //       .checkServiceInCart(foundService, userID)
  //       .then(async (servicesWithStatus) => {
  //         return res.json({
  //           servicesWithStatus,
  //           total: servicesWithStatus.length,
  //         });
  if (true) {
    let topServices = await Order.aggregate([
      {
        $group: {
          _id: "$service",
          count: { $sum: 1 },
        },
      },
    ]).limit(10);

    Service.populate(topServices, {
      path: "_id",
      populate: { path: "seller" },
    }).then((topServices) => {
      if (topServices.length < 1) {
        return res
          .json({ msg: "No Service Ordered Yet!", success: false })
          .status(200);
      } else {
        return res
          .json({
            msg: "Top Ten Most Hired Services!",
            topServices: topServices,
            success: true,
          })
          .status(200);
      }
    });
  } else {
    return res
      .json({
        msg: "No Service Found!",
        success: false,
      })
      .status(400);
  }
});

Router.post("/show-all-services-of-specific-seller", (req, res) => {
  let { sellerID } = req.body;

  Service.find({ seller: sellerID, isBlock: false, isLive: true })
    .then((foundServices) => {
      if (foundServices.length > 0) {
        return res
          .json({
            msg: "All Services with average rating",
            foundServices,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({ msg: "No Service aginst this seller", success: false })
          .status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post(
  "/update-service-category",

  (req, res) => {
    let { service } = req.body;

    let message = false;

    if (message === false) {
      ServiceCategory.findOne({ _id: service._id })
        .then((foundCategories) => {
          if (foundCategories !== null) {
            foundCategories.serviceCategoryName =
              foundCategories.serviceCategoryName;

            if (service.serviceCategoryName !== "") {
              foundCategories.serviceCategoryName = service.serviceCategoryName;
            }

            foundCategories
              .save()
              .then((saved) => {
                if (saved) {
                  return res
                    .json({ msg: "Updated", saved, success: true })
                    .status(404);
                } else {
                  return res
                    .json({ msg: "Not Updated", success: false })
                    .status(404);
                }
              })
              .catch((err) => {
                console.log(err);
                return res.json({ msg: "Failed!", success: false }).status(505);
              });
          } else {
            return res.json({ msg: "Not Found", success: false }).status(505);
          }
        })
        .catch((err) => {
          console.log(err);
          return res.json({ msg: "Failed!", success: false }).status(505);
        });
    } else {
      return res.json({ msg: message, success: false }).status(404);
    }
  }
);
Router.post(
  "/update-service-category-img",
  upload.array("serviceCategoryIMG", 9),
  // upload.fields([{ name: "serviceCategoryIMG", maxCount: 1 }]),
  (req, res) => {
    let { data } = req.body;
    let service = JSON.parse(data);
    let imageArrays = req.files;
    let message = false;
    let ImageURLsArray = [];
    imageArrays.forEach((eachFoundPic) => {
      ImageURLsArray.push(`/files/vendor-files/image/${eachFoundPic.filename}`);
    });

    if (imageArrays.length >= 2) {
      message = "Add one Image only!";
    }
    if (message === false) {
      ServiceCategory.findOne({ _id: service._id })
        .then((foundCategories) => {
          if (foundCategories !== null) {
            // foundCategories.serviceCategoryName =
            //   foundCategories.serviceCategoryName;
            foundCategories.categoryImgURL = foundCategories.categoryImgURL;
            if (ImageURLsArray.length > 0) {
              foundCategories.categoryImgURL = ImageURLsArray[0];
            }
            // if (req.files["serviceCategoryIMG"]) {
            //   foundCategories.categoryImgURL = serviceCategoryIMG;
            // }

            // if (service.serviceCategoryName !== "") {
            //   foundCategories.serviceCategoryName = service.serviceCategoryName;
            // }

            foundCategories
              .save()
              .then((saved) => {
                if (saved) {
                  return res
                    .json({ msg: "Updated", saved, success: true })
                    .status(404);
                } else {
                  return res
                    .json({ msg: "Not Updated", success: false })
                    .status(404);
                }
              })
              .catch((err) => {
                console.log(err);
                return res.json({ msg: "Failed!", success: false }).status(505);
              });
          } else {
            return res.json({ msg: "Not Found", success: false }).status(505);
          }
        })
        .catch((err) => {
          console.log(err);
          return res.json({ msg: "Failed!", success: false }).status(505);
        });
    } else {
      return res.json({ msg: message, success: false }).status(404);
    }

    // const serviceCategoryIMG = CreateURL(
    //   req.files["serviceCategoryIMG"][0].filename
    // );

    // let newserviceCategoryName = new ServiceCategory({
    //   serviceCategoryName: service.serviceCategoryName,
    //   categoryImgURL: serviceCategoryIMG,
    // });
    // newserviceCategoryName
    //   .save()
    //   .then((savedCategory) => {
    //     if (savedCategory) {
    //       return res
    //         .json({
    //           msg: "New Service Category Added",
    //           savedCategory: savedCategory,
    //           success: true,
    //         })
    //         .status(200);
    //     } else {
    //       return res.json({ msg: "Not Added", success: false }).status(400);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return res.json({ msg: "Failed!", success: false }).status(505);
    //   });
  }
);
Router.post(
  "/add-new-service-category",
  upload.fields([{ name: "serviceCategoryIMG", maxCount: 4 }]),
  (req, res) => {
    let { data } = req.body;
    let service = JSON.parse(data);

    if (!req.files["serviceCategoryIMG"]) {
      return res.json({ msg: "Img is Compulsory", success: false }).status(404);
    }
    if (service.serviceCategoryName === "") {
      return res
        .json({ msg: "Invalid serviceCategoryName", success: false })
        .status(404);
    }

    const serviceCategoryIMG = CreateURL(
      req.files["serviceCategoryIMG"][0].filename
    );

    let newserviceCategoryName = new ServiceCategory({
      serviceCategoryName: service.serviceCategoryName,
      categoryImgURL: serviceCategoryIMG,
    });
    newserviceCategoryName
      .save()
      .then((savedCategory) => {
        if (savedCategory) {
          return res
            .json({
              msg: "New Service Category Added",
              savedCategory: savedCategory,
              success: true,
            })
            .status(200);
        } else {
          return res.json({ msg: "Not Added", success: false }).status(400);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "Failed!", success: false }).status(505);
      });
  }
);

///////////Sign up with Image of seller/////////////
Router.post(
  "/update-service-images",
  upload.array("IMGs", 5),
  async (req, res) => {
    // let Deleted = await deleteImg.deleteImgFile();
    // if (Deleted === "File Deleted") {
    //   return res.json({ del: Deleted });
    // }
    // return res.json(Deleted);

    let { data } = req.body;
    let ImgArray = [];
    let IMGs = req.files;
    IMGs.forEach((eachFoundPic) => {
      ImgArray.push(`/files/vendor-files/image/${eachFoundPic.filename}`);
    });
    let service = JSON.parse(data);
    let foundService = await Service.findOne({ _id: service._id });
    let saveService = "";
    if (service.isServiceOrCertificateImg === true) {
      //update or delete image of service
      if (ImgArray.length > 0) {
        //add image in servic
        for (let k = 0; k < ImgArray.length; k++) {
          foundService.serviceImgsURLs.push(ImgArray[k]);
        }
        saveService = await foundService.save();
        if (saveService) {
        }
      }

      ///remove URL from table and chunks from db files
      if (service.removeURL.length > 0) {
        await Service.update(
          { _id: service._id },
          { $pullAll: { serviceImgsURLs: service.removeURL } }
        );
      }

      let foundService1 = await Service.findOne({ _id: service._id });
      return res
        .json({
          msg: "Service Update",
          foundService: foundService1,
          success: true,
        })
        .status(200);
    } else {
      //update or delete image of certificate
      //update or delete image of service
      if (ImgArray.length > 0) {
        //add image in servic
        for (let k = 0; k < ImgArray.length; k++) {
          foundService.certificatesImgsURLs.push(ImgArray[k]);
        }
        saveService = await foundService.save();
        if (saveService) {
        }
      }

      ///remove URL from table and chunks from db files
      if (service.removeURL.length > 0) {
        await Service.update(
          { _id: service._id },
          { $pullAll: { certificatesImgsURLs: service.removeURL } }
        );
      }
      //pulllll
      let foundService1 = await Service.findOne({ _id: service._id });
      return res
        .json({
          msg: "Service Update",
          foundService: foundService1,
          success: true,
        })
        .status(200);
    }

    // return res.json({ service, IMGs });
  }
);

///////////Sign up with Image of seller/////////////
Router.post(
  "/add-new-service-of-seller-with-image",
  upload.array("serviceImgs", 5),

  async (req, res) => {
    // return res.json({ msg: "Return from start of api" });
    let { data } = req.body;
    let serviceImgArray = [];
    let serviceImgs = req.files;

    serviceImgs.forEach((eachFoundPic) => {
      serviceImgArray.push(
        `/files/vendor-files/image/${eachFoundPic.filename}`
      );
    });
    // return res.json({ serviceImgArray: serviceImgArray });
    console.log("serviceImgs");
    console.log(serviceImgs);

    //  else {
    //   console.log("serviceImgArray");
    //   console.log(serviceImgArray);
    //   return res.json({ msg: "else No image received" });
    // }
    // // for (let x = 0; x < req.files["serviceImgs"].length; x++) {
    //   serviceImgArray.push(CreateURL(req.files["serviceImgs"][x].filename));
    // }

    // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
    let service = JSON.parse(data);
    //VALIDATIONS STARTS HERE
    let message = false;
    if (req.files.length <= 0) {
      message = "req.files.length invalid!";
    } else if (serviceImgArray.length <= 0) {
      message = "serviceImgArray.length invalid!";
    } else if (serviceImgs.length <= 0) {
      message = "serviceImgs.length invalid!";
    } else if (service.serviceName === "") {
      message = "invalid service name";
    } else if (service.seller === "") {
      message = "invalid seller";
    } else if (service.category === "") {
      message = "invalid category";
    } else if (service.price === "") {
      message = "invalid price";
    } else if (service.description === "") {
      message = "invalid description";
    } else if (service.serviceDaysArray.day === "") {
      message = "invalid serviceDaysArray.day";
    } else if (service.serviceDaysArray.toTime === "") {
      message = "invalid toTime";
    } else if (service.serviceDaysArray.fromTime === "") {
      message = "invalid fromTime";
    } else {
      message = false;
    }
    if (message === false) {
      let foundSeller = await Seller.findOne({ _id: service.seller });
      if (foundSeller.isOrderBlocked === true || foundSeller.isBlock === true) {
        return res.json({ msg: "You are Blocked", success: false }).status(404);
      } else {
        if (foundSeller.isProfileCompleted === false) {
          return res
            .json({ msg: "Your Profile Is not completed Yet", success: false })
            .status(404);
        } else {
          Service.findOne({ serviceName: service.serviceName })
            .then((fEmail) => {
              if (fEmail !== null) {
                return res
                  .json({ msg: "Service Name Already Exist!", success: false })
                  .status(400);
              } else {
                let newService = new Service({
                  serviceName: service.serviceName,
                  seller: service.seller,
                  category: service.category,
                  price: service.price,
                  description: service.description,
                  serviceDaysArray: service.serviceDaysArray,
                  serviceImgsURLs: serviceImgArray,
                  certificatesImgsURLs: service.certificatesImgs,
                });
                newService
                  .save()
                  .then(async (sService) => {
                    let foundService = await Service.findOne({
                      _id: sService._id,
                    }).populate({ path: "category" });
                    if (sService) {
                      return res
                        .json({
                          msg: "Service Created!",
                          newService: foundService,
                          success: true,
                        })
                        .status(200);
                    } else {
                      return res
                        .json({ msg: "Service Not Save!", success: false })
                        .status(400);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    console.log("error found");
                    return res
                      .json({
                        msg: "Service catch error  123",
                        err,
                        success: false,
                      })
                      .status(400);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
              return res
                .json({ msg: "Catch Error Email", success: false })
                .status(400);
            });
        }
      }
    } else {
      return res.json({ msg: message, success: false }).status(400);
    }
  }
);

Router.post("/upload", upload.array("image", 1), (req, res) => {
  let imageArrays = req.files;
  let ImageURLsArray = [];
  imageArrays.forEach((eachFoundPic) => {
    ImageURLsArray.push(`/files/vendor-files/image/${eachFoundPic.filename}`);
  });

  if (ImageURLsArray.length > 0) {
    return res
      .json({
        msg: "Imgae Uploaded!",
        imgurl: ImageURLsArray[0],
        success: true,
      })
      .status(400);
  } else {
    return res.json({ msg: "Failed!", success: false }).status(400);
  }
});

Router.post(
  "/update-service-of-seller-with-image",
  upload.fields([
    { name: "certificatesImgs", maxCount: 1 },
    { name: "serviceImgs", maxCount: 1 },
  ]),
  (req, res) => {
    let { data } = req.body;
    let serviceImgArray = [];
    // const serviceImgs = CreateURL(req.files["serviceImgss"][0].filename);
    // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
    let service = JSON.parse(data);

    //VALIDATIONS STARTS HERE
    let message = false;
    if (service.serviceName === "") {
      message = "invalid service name";
    } else if (service._id === "") {
      message = "invalid _id";
    }
    //  else if (service.category === "") {
    //   message = "invalid category";
    // }
    else if (service.price === "") {
      message = "invalid price";
    } else if (service.description === "") {
      message = "invalid description";
    } else if (service.serviceDaysArray === "") {
      message = "invalid serviceDaysArray";
    } else if (service.toTime === "") {
      message = "invalid toTime";
    } else if (service.fromTime === "") {
      message = "invalid fromTime";
    } else {
      message = false;
    }
    if (message === false) {
      Service.findOne({ _id: service._id })
        .then((foundService) => {
          if (foundService !== null) {
            foundService.serviceName = service.serviceName;
            foundService.seller = foundService.seller;
            foundService.category = foundService.category;
            foundService.price = service.price;
            foundService.description = service.description;
            foundService.serviceDaysArray = service.serviceDaysArray;
            foundService.toTime = service.toTime;
            foundService.fromTime = service.fromTime;
            foundService.serviceImgsURLs = foundService.serviceImgsURLs;
            // return res.json({ aaa: req.files["serviceImgs"] === null });
            if (req.files["serviceImgs"]) {
              // for (let x = 0; x < req.files["serviceImgs"].length; x++) {
              if (
                req.files["serviceImgs"][0].filename !== null &&
                req.files["serviceImgs"][0].filename !== "" &&
                req.files["serviceImgs"][0].filename !== undefined
              ) {
                serviceImgArray.push(
                  CreateURL(req.files["serviceImgs"][0].filename)
                );
                foundService.serviceImgsURLs = serviceImgArray;
              } else {
                return res.json({ msg: "Invalid Images", success: false });
              }
              // }
            }
            //
            // if (req.files["certificatesImgs"]) {
            foundService.certificatesImgsURLs =
              foundService.certificatesImgsURLs;
            // }
            foundService
              .save()
              .then((sService) => {
                if (sService) {
                  return res
                    .json({
                      msg: "Service Updated!",
                      newService: sService,
                      success: true,
                    })
                    .status(200);
                } else {
                  return res
                    .json({ msg: "Service Not Updated!", success: false })
                    .status(400);
                }
              })
              .catch((err) => {
                console.log(err);
                console.log("error found");
                return res
                  .json({ msg: "Service catch error", err, success: false })
                  .status(400);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          return res
            .json({ msg: "Catch Error Email", success: false })
            .status(400);
        });
    } else {
      return res.json({ msg: message, success: false }).status(400);
    }
  }
);

Router.post("/live-or-hide-service-by-seller", (req, res) => {
  let { serviceID, isLive } = req.body;

  Service.findOne({ _id: serviceID })
    .then((foundService) => {
      if (foundService !== null) {
        foundService.isLive = isLive;
        found;
        foundService
          .save()
          .then((updateService) => {
            if (updateService !== null) {
              return res
                .json({ msg: "Service Updated", updateService, success: true })
                .status(500);
            } else {
              return res
                .json({ msg: "Service Not Updated", success: false })
                .status(500);
            }
          })
          .catch((err) => {
            console.log(err);
            return res.json({ msg: "Failed", success: false }).status(500);
          });
      } else {
        return res
          .json({ msg: "Service Not Found", success: false })
          .status(500);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", err, success: false }).status(500);
    });
});

Router.post("/delete-service", (req, res) => {
  let { _id } = req.body;
  Service.remove({ _id: _id })
    .then((foundService) => {
      if (foundService.n === 1) {
        return res
          .json({
            msg: "Service  Deleted!",
            removedService: _id,
            success: true,
          })
          .status(200);
      } else {
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
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/show-single-service", (req, res) => {
  let { _id } = req.body;
  Service.findOne({ _id: _id })
    .populate({ path: "category" })
    .populate({ path: "seller" })
    .then((foundService) => {
      if (foundService) {
        if (foundService.isBlock === true) {
          return res
            .json({ msg: "Service is Blocked", success: false })
            .status(404);
        }
        Reviews.find({ service: _id })
          .populate({ path: "user" })
          .then((foundReviews) => {
            if (foundReviews.length > 0) {
              let sumRating = 0;
              let avgRating = 0;
              for (let k = 0; k < foundReviews.length; k++) {
                sumRating = foundReviews[k].rating + sumRating;
              }
              avgRating = sumRating / foundReviews.length;
              // let result = foundReviews;

              // if (foundReviews.length < 1) {
              //   result = null;
              // }
              return res
                .json({
                  msg: "Service Found!",
                  foundService: foundService,
                  foundReviews: foundReviews,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({
                  msg: "Service Found!",
                  foundService: foundService,
                  foundReviews: foundReviews,
                  success: true,
                })
                .status(200);
            }
          })
          .catch((err) => {
            console.log(err);
            return res.json({ msg: "Failed!", success: false }).status(505);
          });

        ///gooto
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

///////////Sign up with Image of seller/////////////
Router.post(
  "/add-new-certificate-in-existing-service",
  upload.fields([{ name: "certificatesImgs", maxCount: 4 }]),
  (req, res) => {
    let { data } = req.body;
    let certificateImgArray = [];
    for (let y = 0; y < req.files["certificatesImgs"].length; y++) {
      certificateImgArray.push(
        CreateURL(req.files["certificatesImgs"][y].filename)
      );
    }
    // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
    let service = JSON.parse(data);
    //VALIDATIONS STARTS HERE
    let message = false;
    if (service._id === "") {
      message = "invalid _id";
    } else {
      message = false;
    }
    if (message === false) {
      Service.findOne({ _id: service._id })
        .then((foundService) => {
          for (let y = 0; y < certificateImgArray.length; y++) {
            let imgURLs = certificateImgArray[y];
            console.log("imgURLs");
            console.log(imgURLs);
            foundService.certificatesImgsURLs.push(imgURLs);
          }
          foundService
            .save()
            .then((savedCertificate) => {
              if (savedCertificate) {
                return res
                  .json({
                    msg: "Certificate added!",
                    newCertificate: savedCertificate,
                    success: true,
                  })
                  .status(200);
              } else {
                return res
                  .json({ msg: "Service Not Save!", success: false })
                  .status(400);
              }
            })
            .catch((err) => {
              console.log(err);
              console.log("error found");
              return res
                .json({ msg: "Service catch error", err, success: false })
                .status(400);
            });
        })
        .catch((err) => {
          console.log(err);
          return res
            .json({ msg: "Catch Error Email", success: false })
            .status(400);
        });
    } else {
      return res.json({ msg: message, success: false }).status(400);
    }
  }
);

///////////Sign up with Image of seller/////////////
Router.post(
  "/test-api",
  upload.fields([
    // { name: "certificatesImgs", maxCount: 4 },
    { name: "serviceImgs", maxCount: 3 },
  ]),
  (req, res) => {
    let serviceImgArray = [];
    for (let x = 0; x < req.files["serviceImgs"].length; x++) {
      console.log(req.files["serviceImgs"][x].filename);
      serviceImgArray.push(CreateURL(req.files["serviceImgs"][x].filename));
    }
    // let { data } = req.body;
    // let service = JSON.parse(req.files["serviceImgs"].length);
    console.log(serviceImgArray);
    let abc = req.files["serviceImgs"].length;
    return res.json({ length: abc });
  }
);

Router.post("/delete-service-category", (req, res) => {
  let { _id } = req.body;
  ServiceCategory.remove({ _id: _id })
    .then((foundCategories) => {
      if (foundCategories.n === 1) {
        return res
          .json({
            msg: "Service Category Deleted!",
            removedCategory: _id,
            success: true,
          })
          .status(200);
      } else {
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
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/show-all-service-categories", (req, res) => {
  ServiceCategory.find()
    .then((foundCategories) => {
      if (foundCategories.length > 0) {
        return res
          .json({
            msg: "Service Category Found!",
            foundCategories: foundCategories,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "No Category Found!",
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

Router.post("/show-single-service-category", (req, res) => {
  let { _id } = req.body;
  ServiceCategory.findOne({ _id: _id })
    .then((foundCategory) => {
      if (foundCategory) {
        return res
          .json({
            msg: "Service Category Found!",
            foundCategory: foundCategory,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "No Category Found!",
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

Router.post(
  "/add-new-service-category",
  upload.fields([{ name: "serviceCategoryIMG", maxCount: 4 }]),
  (req, res) => {
    let { data } = req.body;
    let service = JSON.parse(data);

    if (!req.files["serviceCategoryIMG"]) {
      return res.json({ msg: "Img is Compulsory", success: false }).status(404);
    }
    if (service.serviceCategoryName === "") {
      return res
        .json({ msg: "Invalid serviceCategoryName", success: false })
        .status(404);
    }

    const serviceCategoryIMG = CreateURL(
      req.files["serviceCategoryIMG"][0].filename
    );

    let newserviceCategoryName = new ServiceCategory({
      serviceCategoryName: service.serviceCategoryName,
      categoryImgURL: serviceCategoryIMG,
    });
    newserviceCategoryName
      .save()
      .then((savedCategory) => {
        if (savedCategory) {
          return res
            .json({
              msg: "New Service Category Added",
              savedCategory: savedCategory,
              success: true,
            })
            .status(200);
        } else {
          return res.json({ msg: "Not Added", success: false }).status(400);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "Failed!", err, success: false }).status(505);
      });
  }
);

module.exports = Router;
