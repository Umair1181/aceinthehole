const Router = require("express").Router();
const { WishList, Service } = require("../../MODELS");
// const serviceClass = require("../BusinessLogics/service");
///////////////////// Add Wishlist API starts HERE ///////////////////
Router.post("/add-wishlist", (req, res) => {
  let { wishlist } = req.body;
  let serviceArray = [];
  let message = "";
  if (wishlist.sellerID === "") {
    message = "Invalid Seller";
  } else if (wishlist.userID === "") {
    message = "Invalid userID";
  } else if (wishlist.serviceID === "") {
    message = "Invalid serviceID";
  } else {
    message = false;
  }
  if (message === false) {
    WishList.findOne({ user: wishlist.userID })
      .populate({
        path: "seller",
      })
      .then((WishListExist) => {
        if (WishListExist !== null) {
          WishListExist.service.push(wishlist.serviceID);
          WishListExist.save()
            .then((savedWishList) => {
              if (savedWishList !== null) {
                Service.findOne({ _id: wishlist.serviceID })
                  .populate({
                    path: "seller",
                    // select:
                    //   "_id isOnline sellerImgURL email shopName sellerName",
                  })
                  .populate({ path: "seller" })
                  //   .populate({ path: "size" })
                  //   .populate({
                  //     path: "review",
                  //     select: "_id firstName lastName userIDImgURL",
                  //   })
                  .then((service) => {
                    // new serviceClass()
                    //   .checkInservice(service, wishlist.userID)
                    //   .then((serviceWithStatus) => {
                    return res
                      .json({
                        msg: "Previous WishList Updated",
                        savedWishList: savedWishList._id,
                        seller: savedWishList.seller,
                        service: service,
                        success: true,
                      })
                      .status(200);
                    //   })
                    //   .catch((err) => {
                    //     console.log("service in wishlist catch error");
                    //     console.log(err);
                    //     return res
                    //       .json({ msg: "Failed! ", success: false })
                    //       .status(400);
                    //   });
                  })
                  .catch((err) => {
                    console.log(err);
                    console.log("service load catch error");
                  });
              } else {
                return res
                  .json({ msg: "Not Saved", success: false })
                  .status(400);
              }
            })
            .catch((err) => {
              console.log(err);
              return res
                .json({
                  msg: "catch error : service Not Saved",
                  success: false,
                })
                .status(400);
            });
        } else {
          let newWishList = new WishList({
            seller: wishlist.sellerID,
            services: wishlist.serviceID,
            user: wishlist.userID,
          });
          newWishList
            .save()
            .then((sWishist) => {
              console.log(sWishist);
              if (sWishist) {
                WishList.findOne({ _id: sWishist._id })
                  .populate({
                    path: "seller",
                    // select:
                    //   "_id isOnline sellerImgURL email shopName sellerName",
                  })
                  //   .populate({ path: "service", populate: { path: "color" } })
                  //   .populate({ path: "service", populate: { path: "size" } })

                  // .populate({ path: "service.color" })
                  // .populate({ path: "service.size" })
                  //   .populate({
                  //     path: "service.review.user",
                  //     select: "_id firstName lastName userImgURL",
                  //   })
                  .then((resNewWsihlList) => {
                    // resNewWsihlList.service[0].inWishList = true; // updating inWishlist status
                    return res
                      .json({
                        msg: "Services Added to WishlList",
                        AddedWishList: resNewWsihlList,
                        success: true,
                      })
                      .status(200);
                  })
                  .catch((err) => {
                    console.log(err);
                    return res
                      .json({
                        msg: "New Wish List REsponse Catch error, Failed",
                        success: false,
                      })
                      .status(500);
                  });
              } else {
                return res
                  .json({
                    msg: "wishlist not Saved",
                    success: false,
                  })
                  .status(400);
              }
            })
            .catch((err) => {
              console.log(err);
              return res
                .json({
                  msg: "catch error : wishlisht not saved!!!!  ",
                  success: false,
                })
                .status(400);
            });
        }
      })
      .catch((err) => {
        return res
          .json({ msg: "catch error: service not exist", success: false })
          .status(400);
      });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
});
// Router.post("/check-service-availability-in-wishlist", (req, res) => {
//   let { data } = req.body;
//   let message = false;
//   if (data.wishlist) {
//     message = "Invalid Wishlist";
//   } else if (data.user) {
//     message = "Invalid User";
//   } else if (data.service) {
//     message = "Invalid service";
//   } else {
//     message = false;
//   }
//   // { <array field>: { <operator1>: <value1>, ... } }
//   // db.inventory.find( { dim_cm: { $gt: 25 } } )
//   // db.inventory.find( { tags: "red" } )
//   if (message === false) {
//     // WishList.find({service : { $in: [ { _id: data.service } ] })
//     WishList.find({ service: { $in: [{ service: data.service }] } })
//       .then(foundWishlist => {
//         if (foundWishlist) {
//           return res
//             .json({ msg: "Wishlist FOund", foundWishList, success: true })
//             .status(200);
//         } else {
//           return res
//             .json({ msg: "Wishlist not FOund", success: false })
//             .status(400);
//         }
//       })
//       .catch(err => {
//         return res.json({ msg: err, success: false }).status(404);
//       });
//   } else {
//   }
// });

////////////////////////////// DELETE  wishlist API STARTs BELOW /////////////////////////////
Router.post("/delete-wishlist", (req, res) => {
  let { wishlist } = req.body;
  let message = "";
  if (wishlist.sellerID === "") {
    message = "Invalid sellerID";
  } else if (wishlist.userID === "") {
    message = "Invalid UserID";
  } else if (wishlist.wishlistID === "") {
    message = "Invalid wishlistID";
  } else if (wishlist.serviceID === "") {
    message = "Invalid serviceID";
  } else {
    message = false;
  }
  if (message === false) {
    WishList.update(
      { _id: wishlist.wishlistID },
      { $pull: { services: wishlist.serviceID } }
    )
      .then((wishListDeleted) => {
        console.log(wishListDeleted);
        if (wishListDeleted) {
          WishList.findOne({ _id: wishlist.wishlistID })
            .then((foundWishlst) => {
              if (foundWishlst !== null) {
                if (foundWishlst.services.length < 1) {
                  WishList.remove({ _id: wishlist.wishlistID })
                    .then((widhListRemove) => {
                      return res
                        .json({
                          msg: "service Deleted From WishList",
                          Deleted: {
                            wishlistID: wishlist.wishlistID,
                            sellerID: wishlist.sellerID,
                            serviceID: wishlist.serviceID,
                          },

                          success: true,
                        })
                        .status(200);
                    })
                    .catch((err) => {
                      console.log(err);
                      console.log("wishList Removed cath error");
                      return res
                        .json({
                          msg: "Failed! Wsh list remove catch error",
                          success: false,
                        })
                        .status(500);
                    });
                } else {
                  console.log("case");
                  return res
                    .json({
                      msg: "service Deleted From WishList",
                      Deleted: {
                        wishlistID: wishlist.wishlistID,
                        sellerID: wishlist.sellerID,
                        serviceID: wishlist.serviceID,
                      },
                      success: true,
                    })
                    .status(200);
                }
              } else {
                return res
                  .json({ msg: "Wish List Not Found", success: false })
                  .status(500);
              }
            })
            .catch((err) => {
              console.log(err);
              return res.json({ msg: "not found list", err: err });
            });
        } else {
          return res
            .json({
              msg: "service not deleted",
              success: false,
            })
            .status(500);
        }
      })
      .catch((err) => {
        return res
          .json({
            msg: "catch error",
            err,
            success: false,
          })
          .status(400);
      });
  } else {
    return res.json({ msg: message, success: false }).status(500);
  }
});

///////////////////////////////

Router.post("/show-wishlist-buyer", (req, res) => {
  let { userID } = req.body;
  let message = false;
  let serviceOfWishlist = [];
  let count = 0;
  if (userID === "") {
    message = "Invalid UserID";
  } else {
    message = false;
  }
  if (message === false) {
    WishList.findOne({ user: userID })
      //   .populate({
      //     path: "seller",
      //     // select: "_id isOnline sellerImgURL email shopName sellerName",
      //   })
      //   .populate({ path: "service" })
      .populate({
        path: "services",
        populate: { path: "seller" },
      })
      .then((foundWishList) => {
        //   new serviceClass()
        // .checkShowAllWishListservice(foundWishList, userID)
        // .then((finalFoundservice) => {
        if (foundWishList !== null) {
          return res
            .json({
              msg: "found WishList",
              foundWishList: foundWishList.services,
              success: true,
            })
            .status(200);
          // return res
          //   .json({
          //     msg: "All service against Categories",
          //     serviceCategories: finalFoundservice,
          //     success: true
          //   })
          //   .status(400);
        } else {
          return res
            .json({ msg: "WishList Not found", success: false })
            .status(404);
        }
        // });
        // return res.json({
        //   msg: "Wisl List service",
        //   foundWishList: foundWishList,
        //   success: true
        // });

        // foundWishList.forEach(pro => {
        //   console.log(pro.service.length);
        //   if (pro.service.length > 0) {
        //     serviceOfWishlist.push({
        //       service: pro.service,
        //       seller: pro.seller,
        //       _id: pro._id
        //     });
        //   } else {
        //     count = count + 1;
        //   }

        //   if (serviceOfWishlist.length + count == foundWishList.length) {
        //     return res
        //       .json({
        //         // serviceOfWishlist,
        //         foundWishList: serviceOfWishlist,
        //         success: true
        //         // pro: serviceOfWishlist.length,
        //         // pro2: foundWishList.length
        //       })
        //       .status(200);
        //   } else {
        //     console.log(
        //       `${serviceOfWishlist.length} != ${serviceOfWishlist.length} `
        //     );
        //   }
        // });
        // return res.json({ msg: foundWishList });
      })
      .catch((err) => {
        console.log("cath 1");
        return res
          .json({ msg: "catch error", err, success: false })
          .status(500);
      });
  } else {
    return res.json({ msg: message, success: false }).status(404);
  }
});

module.exports = Router;
