const Router = require("express").Router();
const { Cart, Service } = require("../../MODELS");

/////////////////////add-new-cart-or-update-existing-one///////////////////
Router.post("/add-new-cart-or-update-existing-one", (req, res) => {
  let { cart } = req.body;
  // let productArray = [];
  let message = "";
  if (cart.userID === "") {
    message = "Invalid userID";
  } else if (cart.servicesID === "") {
    message = "Invalid servicesID";
  } else {
    message = false;
  }
  if (message === false) {
    Cart.findOne({ user: cart.userID })
      .populate({
        path: "items.service",
      })
      .then((cartExist) => {
        if (cartExist !== null) {
          cartExist.items.push({ service: cart.servicesID });
          cartExist
            .save()
            .then((savedCart) => {
              if (savedCart !== null) {
                Service.findOne({ _id: cart.servicesID })
                  // .populate({
                  //   path: "items.service",
                  //   // populate: { path: "service" },
                  // })
                  // .populate({
                  //   path: "seller",
                  //   select:
                  //     "_id isOnline sellerImgURL email shopName sellerName",
                  // })

                  .then((foundSerivce) => {
                    return res
                      .json({
                        msg: "Previous Cart Updated",
                        // cartExist: cartExist,
                        foundSerivce: foundSerivce,
                        savedCart: cartExist,
                        // seller: savedCart.seller,
                        success: true,
                      })
                      .status(200);
                  })
                  .catch((err) => {
                    console.log(err);
                    console.log("product load catch error");
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
                  msg: "catch error : Product Not Saved",
                  success: false,
                })
                .status(400);
            });
        } else {
          let newCart = new Cart({
            user: cart.userID,
            items: { service: cart.servicesID },
            // service: cart.servicesID,
          });
          newCart
            .save()
            .then((savedCart) => {
              console.log(savedCart);
              if (savedCart) {
                Cart.findOne({ _id: savedCart._id })
                  .populate({
                    path: "items.service",
                  })
                  // select:
                  // "_id isOnline sellerImgURL email shopName sellerName",
                  .then((savedCarts) => {
                    return res
                      .json({
                        msg: "New Cart  Added",
                        savedCart: savedCarts,
                        success: true,
                      })
                      .status(200);
                  })
                  .catch((err) => {
                    console.log(err);
                    return res
                      .json({
                        msg: "Catch error, Failed",
                        success: false,
                      })
                      .status(500);
                  });
              } else {
                return res
                  .json({
                    msg: "Cart not Saved",
                    success: false,
                  })
                  .status(400);
              }
            })
            .catch((err) => {
              console.log(err);
              return res
                .json({
                  msg: "catch error : cart not saved!!!!  ",
                  success: false,
                })
                .status(400);
            });
        }
      })
      .catch((err) => {
        return res
          .json({ msg: "catch error found", err, success: false })
          .status(400);
      });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
});

/////////////////////////////remove-from-cart-and-delete-cart-if-empty/////////////////////////////
Router.post("/remove-from-cart-and-delete-cart-if-empty", (req, res) => {
  let { cart } = req.body;
  let message = "";
  if (cart.seller === "") {
    message = "Invalid seller";
  } else if (cart.userID === "") {
    message = "Invalid userID";
  } else if (cart._id === "") {
    message = "Invalid _id";
  } else if (cart.servicesID === "") {
    message = "Invalid servicesID";
  } else {
    message = false;
  }
  if (message === false) {
    Cart.update(
      { _id: cart._id },
      { $pull: { items: { service: cart.servicesID } } }
    )
      .then((updatedCart) => {
        if (updatedCart.nModified === 1 || true) {
          Cart.findOne({ _id: cart._id })
            .then((foundCart) => {
              if (foundCart) {
                if (foundCart.items.length >= 1) {
                  return res
                    .json({
                      msg: "items Removed From Cart",
                      updatedCart,
                      success: true,
                    })
                    .status(200);
                } else {
                  Cart.remove({ _id: cart._id })
                    .then((cartRemoved) => {
                      if (cartRemoved.n === 1) {
                        return res
                          .json({
                            msg: "Cart Removed",
                            // cartRemoved,
                            success: true,
                          })
                          .status(200);
                      } else {
                        return res
                          .json({
                            msg: "Cart Not Removed",
                            cartRemoved,
                            success: false,
                          })
                          .status(404);
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
                }
              } else {
                return res
                  .json({ msg: "Cart Not FOund", success: false })
                  .status(404);
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
          return res.json({ msg: "Invalid!!!", success: false });
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

Router.post("/show--user-cart", (req, res) => {
  let { userID } = req.body;
  let message = false;
  //   let productsOfWishlist = [];
  //   let count = 0;
  if (userID === "") {
    message = "Invalid userID";
  } else {
    message = false;
  }
  if (message === false) {
    Cart.find({ user: userID })
      .populate({
        path: "user",
      })
      .populate({
        path: "service",
      })
      .populate({
        path: "items.service",
      })
      //   .populate({ path: "products", populate: { path: "color" } })
      //   .populate({ path: "products", populate: { path: "size" } })
      .then((foundCart) => {
        if (foundCart.length > 0) {
          return res.json({
            msg: "foundCart",
            foundCart: foundCart,
            success: true,
          });
        } else {
          return res
            .json({ msg: "Cart Is Empty!", success: false })
            .status(500);
        }
      })
      .catch((err) => {
        console.log("cath 1");
        console.log(err);
        return res.json({ msg: "catch error", success: false }).status(500);
      });
  } else {
    return res.json({ msg: message, success: false }).status(404);
  }
});

module.exports = Router;
