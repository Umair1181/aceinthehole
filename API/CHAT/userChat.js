// const { Chat, Seller, User, Cart, SellerBank } = require("../../MODALS");
const { Chat, Seller, User, Cart, SellerBank } = require("../../MODELS");
const { Router } = require("express");

///updating online ofline status of connected disconnected uder
// const acceptOffer = (data, socket) => {
//   console.log(data);
//   console.log("Data we got");
//   Chat.findOne({
//     user: data.to,
//     seller: data.from
//     // msgOffer: { $in: [{ _id: data._id }] }
//   })
//     .then(fChat => {
//       let index = fChat.msgOffer.findIndex(m => m._id == data._id);

//       if (index >= 0) {
//         console.log("object offer");
//         console.log(fChat.msgOffer[index].offerStatus);
//         if (fChat.msgOffer[index].offerStatus === false) {
//           console.log("Offer Dsimissed!");
//           data.offerStatus = false;
//           socket.in(data.to).emit("onAcceptOffer", { query: data });
//           socket.in(data.from).emit("onAcceptOffer", { query: data });
//         } else {
//           fChat.msgOffer[index].offerStatus = false;
//           fChat
//             .save()
//             .then(sChat => {

//               Cart.findOne({ seller: data.from, user: data.to })
//               .then(CartExist => {
//                 if (CartExist) {
//                   let  nProducts = {
//                     product: data.payload.productId,
//                     color: data.payload.color,
//                     size: data.payload.size,
//                     quantity: data.payload.quantity
//                   }
//                   CartExist.products.push(nProducts);
//                   CartExist.save()
//                     .then(savedCart => {
//                       if (savedCart) {
//                         Cart.findOne({ _id: savedCart._id })
//                         .populate({ path: "products.product" })
//                         .populate({ path: "products.color" })
//                         .populate({ path: "products.size" })
//                         .populate({ path: "seller", select: "_id sellerName shopName" })
//                         .then( async foundCartofBuyer => {
//                           if (foundCartofBuyer !== null) {

//                               let sellerBank = await SellerBank.findOne({ seller: foundCartofBuyer.seller._id });
//                               foundCartofBuyer.seller.paypalAccountEmail = sellerBank.paypalAccountEmail;

//                              let offerCartEntry ={
//                                       msg: "Previous Cart Updated",
//                                       cart : foundCartofBuyer,
//                                       success: true
//                                     };

//                                     data.cart = offerCartEntry;
//                                     console.log("SAVED CHAT HERE.");
//                                     console.log(sChat.msgOffer[index].offerStatus);
//                                     console.log("Offer Accepted");
//                                     data.offerStatus = false;
//                                     socket.in(data.from).emit("onAcceptOffer", { query: data });
//                                     socket.in(data.to).emit("onAcceptOffer", { query: data });
//                           }
//                         })
//                         .catch(err => {
//                           console.log(err);
//                           console.log("product load catch error");
//                           return res
//                             .json({ msg: "Error FOUND", success: false })
//                             .status(404);
//                         });
//                       } else {
//                         return res
//                           .json({ msg: "Not Saved", success: false })
//                           .status(400);
//                       }
//                     })
//                     .catch(err => {
//                       return res
//                         .json({ msg: "Product Not Saved", success: false })
//                         .status(400);
//                     });
//                 } else {

//                  let  nProducts = {
//                     product: data.payload.productId,
//                     color: data.payload.color,
//                     size: data.payload.size,
//                     quantity: data.payload.quantity
//                   }
//                   let newCart = new Cart({
//                     products: nProducts,
//                     seller:  data.from,
//                     user:  data.to
//                     // status:customCart
//                   });
//                   newCart
//                     .save()
//                     .then(sCart => {
//                       if (sCart) {
//                         Cart.findOne({ _id: sCart._id })
//                           .populate({
//                             path: "seller",
//                             select: "_id sellerName shopName"
//                           })
//                           .populate({ path: "products.product" })
//                           .then( async foundCart => {
//                             if (foundCart) {
//                               foundCart.products[0].totalBill = foundCart.products[0].product.price;
//                               foundCart.products[0].product.inCart = true ;
//                               let sellerBank = await SellerBank.findOne({ seller: foundCart.seller._id });
//                               foundCart.seller.paypalAccountEmail = sellerBank.paypalAccountEmail;

//                              let offerCartEntry = {
//                                   msg: "New Cart List Added",
//                                   AddedCart: foundCart,
//                                   success: true
//                                 }
//                                 data.cart = offerCartEntry;
//                                 console.log("SAVED CHAT HERE.");
//                                 console.log(sChat.msgOffer[index].offerStatus);
//                                 console.log("Offer Accepted");
//                                 data.offerStatus = false;
//                                 socket.in(data.from).emit("onAcceptOffer", { query: data });
//                                 socket.in(data.to).emit("onAcceptOffer", { query: data });

//                             } else {
//                                   console.log("Cart Not Found error")
//                             }
//                           });
//                       } else {
//                          console.log("cart not Saved") ;
//                       }
//                     })
//                     .catch(err => {
//                       console.log("catch error : cart not saved!!!!  ");
//                     });
//                 }
//               })
//               .catch(err => {
//                 console.log( "catch error: product not exist" );
//               });
//               // add to cart
//               // import cart modal above
//               // find user cart with this seller
//               // push cart in that arrayof products
//               // else create new cart of this seller and user with this product

//             })
//             .catch(err => {
//               console.log("SAVING ERROR");
//               console.log(err);
//             });
//         }
//       } else {
//         console.log("not found CHAT HERE.");
//         console.log(index);
//       }

//     })
//     .catch(err => {
//       console.log("Chat Find Catch error");
//     });
// };

const setOnlineStatusSeller = (id, status) => {
  Seller.findOne({ _id: id })
    .then((fSeller) => {
      if (fSeller !== null) {
        fSeller.isOnline = status;
        fSeller
          .save()
          .then((sSeller) => {
            if (sSeller !== null) {
              console.log(`Seller is ${status ? " online" : " offline"} `);
            } else {
              console.log("Check form db");
            }
          })
          .catch((err) => {
            console.log(
              `Saving Seller ${status ? " online" : " offline"}  Catch error`
            );
          });
      } else {
        console.log(
          `Seller not found for Seller ${status ? " online" : " offline"}`
        );
        console.log(`${fSeller}`);
      }
    })
    .catch((err) => {
      console.log(`catch error finding ${status ? " online" : " offline"}`);
    });
};

const setOnlineStatusUser = (id, status) => {
  User.findOne({ _id: id })
    .then((fUser) => {
      if (fUser !== null) {
        fUser.isOnlineStatus = status;
        fUser
          .save()
          .then((sUser) => {
            if (sUser !== null) {
              console.log(`USER is ${status ? " online" : " offline"} `);
            } else {
              console.log("Check form db");
            }
          })
          .catch((err) => {
            console.log(
              `Saving USER ${status ? " online" : " offline"}  Catch error`
            );
          });
      } else {
        console.log(
          `USER not found for Seller ${status ? " online" : " offline"}`
        );
      }
    })
    .catch((err) => {
      console.log(`USER error finding ${status ? " online" : " offline"}`);
    });
};

const saveToDbChat = (data) => {
  if (data.isSeller == true) {
    let seller = data.from;
    let user = data.to;
    Chat.findOne({ user: user, seller: seller })
      .then((foundPreviousChat) => {
        if (foundPreviousChat != null) {
          //update previous chat
          foundPreviousChat.msgOffer.push({
            myType: data.type,
            payload: data.payload,
            from: data.from,
            to: data.to,
          });
          foundPreviousChat.userSeenStatus = false;
          // if( foundPreviousChat.user.toString() === data.to.toString() ){
          // }else{
          //   foundPreviousChat.sellerSeenStatus = false;
          // }
          foundPreviousChat
            .save()
            .then((savedChat) => {
              if (savedChat !== null) {
                console.log("Message Sent and Saved");
                // return res
                //   .json({
                //     msg: "Message Sent and Saved",
                //     success: true
                //   })
                //   .status(200);
              } else {
                console.log("Message Not Saved");

                // return res
                //   .json({ msg: "Message Not Saved", success: false })
                //   .status(404);
              }
            })
            .catch((err) => {
              console.log(err);
              console.log("catch error: newChat.save ");

              // return res.json({ msg: "catch error: newChat.save " });
            });
        } else {
          let newChat = new Chat({
            msgOffer: {
              myType: data.type,
              payload: data.payload,
              from: seller,
              to: user,
            },
            user: user,
            seller: seller,
          });
          newChat
            .save()
            .then((savedChat) => {
              if (savedChat) {
                console.log("Message Sent and Saved");
                // return res
                //   .json({
                //     msg: "Message Sent and Saved",
                //     savedChat: savedChat,
                //     success: true
                //   })
                //   .status(200);
              } else {
                console.log("Message Not Saved");
                // return res
                //   .json({ msg: "Message Not Saved", success: false })
                //   .status(404);
              }
            })
            .catch((err) => {
              console.log(err);
              console.log("Failed Catch Error!");
              // return res
              //   .json({ msg: "Failed Catch Error!", success: false })
              //   .status(500);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("Find User Seller catch error 1");
        // return res
        //   .json({ msg: "Find User Seller catch error 1", success: false })
        //   .status(500);
      });
  } else {
    console.log("Enter in Else");

    let user = data.from;
    let seller = data.to;
    Chat.findOne({ user: user, seller: seller })
      .then((foundPreviousChat) => {
        if (foundPreviousChat != null) {
          //update previous chat
          console.log(  "update previous chat>>>>>>>>>>>>");
          foundPreviousChat.msgOffer.push({
            myType: data.type,
            from: data.from,
            to: data.to,
            payload: data.payload,
          });
          // seen status
          foundPreviousChat.sellerSeenStatus = false;
          console.log(`${data.from} and  ${data.to}`);
          console.log("After Push");

          foundPreviousChat
            .save()
            .then((savedChat) => {
              if (savedChat !== null) {
                console.log(savedChat);
                console.log("Chat is Updated");
                // return res
                //   .json({
                //     msg: "Chat is Updated",
                //     //   savedChat: foundPreviousChat,
                //     success: true
                //   })
                //   .status(200);
              } else {
                console.log("Chat NOT Update");
                // return res
                //   .json({ msg: "Chat NOT Update", success: false })
                //   .status(404);
              }
            })
            .catch((err) => {
              console.log("catch error: newChat.save ");
              // return res.json({ msg: "catch error: newChat.save " });
            });
        } else {
          console.log( "create new chat>>>>>>>>>>> " );
          let newChat = new Chat({
            msgOffer: {
              myType: data.type,
              payload: data.payload,
              from: user,
              to: seller,
            },
            user: user,
            seller: seller,
          });
          newChat
            .save()
            .then((savedChat) => {
              if (savedChat) {
                console.log("Chat is Saved");
                // return res
                //   .json({
                //     msg: "Chat is Saved",
                //     savedChat: savedChat,
                //     success: true
                //   })
                //   .status(200);
              } else {
                console.log("Chat NOT Saved");
                // return res
                //   .json({ msg: "Chat NOT Saved", success: false })
                //   .status(404);
              }
            })
            .catch((err) => {
              console.log(err);
              console.log("Catch error of New Chat save");

              // return res
              //   .json({ msg: "catch error: newChat.save ", success: false })
              //   .status(500);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("Find User Seller catch error ''");
        // return res
        //   .json({ msg: "Find User Seller catch error ''", success: false })
        //   .status(500);
      });
  }
};

const saveOfferToDbChat = (data, socket) => {
  console.log("data");
  console.log(data);

  if (data.isSeller === true) {
    console.log("check 1");
    let seller = data.from;
    let user = data.to;
    Chat.findOne({ user: user, seller: seller })
      .then((foundPreviousChat) => {
        if (foundPreviousChat != null) {
          console.log("chat found!");
          //update previous chat
          // console.log( data.randomId );
          // console.log( "data.randomId" );
          console.log(" data.type");
          console.log(data.type);
          foundPreviousChat.msgOffer.push({
            myType: data.type,
            payload: data.payload,
            // offerStatus: data.offerStatus,
            from: seller,
            to: user,
            // randomId : data.randomId
          });
          foundPreviousChat
            .save()
            .then((savedChat) => {
              if (savedChat !== null) {
                console.log("Message Sent and Saved");
                // @todo
                data.payload =
                  savedChat.msgOffer[savedChat.msgOffer.length - 1].payload;
                data._id =
                  savedChat.msgOffer[savedChat.msgOffer.length - 1]._id;
                console.log("data._id");
                data.offerStatus = true;
                // console.log(data._id );
                console.log(data);
                socket.in(data.to).emit("onRecieve", { query: data });
                // return res
                //   .json({
                //     msg: "Message Sent and Saved",
                //     success: true
                //   })
                //   .status(200);
              } else {
                console.log("Message Not Saved");

                // return res
                //   .json({ msg: "Message Not Saved", success: false })
                //   .status(404);
              }
            })
            .catch((err) => {
              console.log(err);
              console.log("catch error: newChat.save ");

              // return res.json({ msg: "catch error: newChat.save " });
            });
        } else {
          console.log("chat not found!");
          let newChat = new Chat({
            msgOffer: {
              myType: data.type,
              payload: data.payload,
              from: seller,
              to: user,
              randomId: data.randomId,
            },
            user: user,
            seller: seller,
          });
          newChat
            .save()
            .then((savedChat) => {
              if (savedChat) {
                // @todo
                data.payload = savedChat.payload;
                data._id = savedChat.msgOffer._id;
                console.log("data._id");

                console.log(savedChat);
                socket.in(data.to).emit("onRecieve", { query: data });

                console.log("Message Sent and Saved");
                // return res
                //   .json({
                //     msg: "Message Sent and Saved",
                //     savedChat: savedChat,
                //     success: true
                //   })
                //   .status(200);
              } else {
                console.log("Message Not Saved");
                // return res
                //   .json({ msg: "Message Not Saved", success: false })
                //   .status(404);
              }
            })
            .catch((err) => {
              console.log(err);
              console.log("Failed Catch Error!");
              // return res
              //   .json({ msg: "Failed Catch Error!", success: false })
              //   .status(500);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("Find User Seller catch error 1");
        // return res
        //   .json({ msg: "Find User Seller catch error 1", success: false })
        //   .status(500);
      });
  } else {
    console.log("else case");
  }
  // else {
  //   let user = data.from;
  //   let seller = data.to;
  //   Chat.findOne({ user: user, seller: seller })
  //     .then(foundPreviousChat => {
  //       if (foundPreviousChat != null) {
  //         //update previous chat
  //         foundPreviousChat.msgOffer.push({
  //           myType: data.type,
  //           payload: data.payload,
  //           offerStatus: data.offerStatus,
  //           from: user,
  //           to: seller
  //         });
  //         foundPreviousChat
  //           .save()
  //           .then(savedChat => {
  //             if (savedChat !== null) {
  //               console.log("Chat is Updated");
  //               // return res
  //               //   .json({
  //               //     msg: "Chat is Updated",
  //               //     //   savedChat: foundPreviousChat,
  //               //     success: true
  //               //   })
  //               //   .status(200);
  //             } else {
  //               console.log("Chat NOT Update");
  //               // return res
  //               //   .json({ msg: "Chat NOT Update", success: false })
  //               //   .status(404);
  //             }
  //           })
  //           .catch(err => {
  //             console.log("catch error: newChat.save ");
  //             // return res.json({ msg: "catch error: newChat.save " });
  //           });
  //       } else {
  //         let newChat = new Chat({
  //           msgOffer: {
  //             myType: data.type,
  //             payload: data.payload,
  //             from: user,
  //             to: seller
  //           },
  //           user: user,
  //           seller: seller
  //         });
  //         newChat
  //           .save()
  //           .then(savedChat => {
  //             if (savedChat) {
  //               console.log("Chat is Saved");
  //               // return res
  //               //   .json({
  //               //     msg: "Chat is Saved",
  //               //     savedChat: savedChat,
  //               //     success: true
  //               //   })
  //               //   .status(200);
  //             } else {
  //               console.log("Chat NOT Saved");
  //               // return res
  //               //   .json({ msg: "Chat NOT Saved", success: false })
  //               //   .status(404);
  //             }
  //           })
  //           .catch(err => {
  //             console.log(err);
  //             console.log("Catch error of New Chat save");

  //             // return res
  //             //   .json({ msg: "catch error: newChat.save ", success: false })
  //             //   .status(500);
  //           });
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       console.log("Find User Seller catch error ''");
  //       // return res
  //       //   .json({ msg: "Find User Seller catch error ''", success: false })
  //       //   .status(500);
  //     });
  // }
};
module.exports = {
  setOnlineStatusUser,
  setOnlineStatusSeller,
  saveToDbChat,
  saveOfferToDbChat,
  // acceptOffer
};
