const Router = require("express").Router();
const bcrypt = require("bcryptjs");
// const randomize = require("randomatic");
// const Transporter = require("../emailSend");
// const ProductPostClass = require("../BusinessLogic/user");

const { User } = require("../../MODELS");
const { upload } = require("../../storage")();
///email send import
const randomize = require("randomatic");
const transporter = require("../emailSend");

////////////////////////////////////// user-availabilty-check-by-email API ///////////////////////////////////
Router.post("/user-availabilty-check-by-email", (req, res) => {
  let { userEmail } = req.body;
  User.findOne({ email: userEmail })
    .then((fUser) => {
      if (fUser) {
        return res
          .json({ msg: "User Authenticated", foundUser: fUser, success: true })
          .status(200);
      } else {
        return res.json({ msg: "No User Exist", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      console.log("err found");
      return res
        .json({ msg: "catch error user not found", success: false })
        .status(400);
    });
});

////////////////////////////////////// update-user-paypal-email API ///////////////////////////////////
Router.post("/update-user-paypal-email", (req, res) => {
  let { paypalEmail, userID } = req.body;

  let message = "";
  if (paypalEmail === "") {
    message = "Invalid paypalEmail ";
  } else if (userID === "") {
    message = "Invalid userID ";
  } else {
    message = false;
  }
  if (message === false) {
    User.findOne({ _id: userID })
      .then((fUser) => {
        if (fUser) {
          console.log(fUser);
          fUser.paypalAccountEmail = paypalEmail;
          console.log(fUser.paypalAccountEmail);
          fUser
            .save()
            .then((saveduserBank) => {
              if (saveduserBank) {
                return res
                  .json({
                    msg: " User's paypalEmail Added Successfully!",
                    SaveduserBank: saveduserBank,
                    success: true,
                  })
                  .status(200);
              } else {
                return res
                  .json({
                    msg: " User Not Update!",
                    success: false,
                  })
                  .status(400);
              }
            })
            .catch((err) => {
              console.log(err);
              console.log("err found");
              return res.json({ msg: "failed", success: false }).status(400);
            });
        } else {
          return res
            .json({ msg: "Such User Not Exist", success: false })
            .status(400);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("err found");
        return res
          .json({ msg: "catch error user not found", success: false })
          .status(400);
      });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
});

////////////////////////////////////// update-user-bank-card-info API ///////////////////////////////////
Router.post("/update-user-bank-card-info", (req, res) => {
  let { userBank } = req.body;

  let message = "";
  if (userBank.userID === "") {
    message = "Invalid user ";
  } else if (userBank.cardNo === "") {
    message = "Invalid cardNo";
  } else if (userBank.CVV === "") {
    message = "Invalid CVV";
  } else if (userBank.expiryDate === "") {
    message = "Invalid expiryDate";
  } else {
    message = false;
  }
  if (message === false) {
    User.findOne({ _id: userBank.userID })
      .then((fUser) => {
        if (fUser) {
          fUser.Bank = {
            cardNo: userBank.cardNo,
            CVV: userBank.CVV,
            expiryDate: userBank.expiryDate,
          };
          fUser
            .save()
            .then((saveduserBank) => {
              if (saveduserBank) {
                return res
                  .json({
                    msg: " User's Bank Added Successfully In User",
                    SaveduserBank: saveduserBank,
                    success: true,
                  })
                  .status(200);
              } else {
                return res
                  .json({
                    msg: " User Not Update!",
                    success: false,
                  })
                  .status(400);
              }
            })
            .catch((err) => {
              console.log(err);
              console.log("err found");
              return res.json({ msg: "failed", success: false }).status(400);
            });
        } else {
          return res
            .json({ msg: "Such User Not Exist", success: false })
            .status(400);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("err found");
        return res
          .json({ msg: "catch error user not found", success: false })
          .status(400);
      });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
});

////////////////////////////////////// update-user-billing-info API ///////////////////////////////////
Router.post("/update-user-billing-info", (req, res) => {
  let { userBilling } = req.body;

  let message = "";
  if (userBilling.userID === "") {
    message = "Invalid user ";
  } else if (userBilling.billingName === "") {
    message = "Invalid billingName";
  } else if (userBilling.billingAddress === "") {
    message = "Invalid billingAddress";
  } else if (userBilling.billingContact === "") {
    message = "Invalid billingContact";
  } else {
    message = false;
  }
  if (message === false) {
    User.findOne({ _id: userBilling.userID })
      .then((fUser) => {
        if (fUser) {
          // fUser.firstName = fUser.firstName;
          // fUser.lastName = fUser.lastName;
          // fUser.email = fUser.email;
          // fUser.password = fUser.password;
          fUser.Bill = {
            billingName: userBilling.billingName,
            billingAddress: userBilling.billingAddress,
            billingContact: userBilling.billingContact,
          };
          fUser
            .save()
            .then((savedUserBilling) => {
              if (savedUserBilling) {
                return res
                  .json({
                    msg: " User's Billing Added Successfully In User",
                    SavedUserBilling: savedUserBilling,
                    success: true,
                  })
                  .status(200);
              } else {
                return res
                  .json({
                    msg: " User Not Update!",
                    success: false,
                  })
                  .status(400);
              }
            })
            .catch((err) => {
              console.log(err);
              console.log("err found");
              return res.json({ msg: "failed", success: false }).status(400);
            });
        } else {
          return res
            .json({ msg: "Such User Not Exist", success: false })
            .status(400);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("err found");
        return res
          .json({ msg: "catch error user not found", success: false })
          .status(400);
      });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
}); //add  User billing ends here

// ////////////////SHOW SINGLE user DETAILS//////
Router.post("/update-user-billing-info", (req, res) => {
  let { userID } = req.body;
  User.findOne({ _id: userID })
    .then((foundUser) => {
      if (foundUser !== null) {
      } else {
        return res.json({ msg: "No User", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/user-online-offline-toggle", (req, res) => {
  let { userID } = req.body;

  User.findOne({ _id: userID })
    .then((foundUser) => {
      if (foundUser) {
        foundUser.isOnlineStatus = !foundUser.isOnlineStatus;
        foundUser
          .save()
          .then((savedUser) => {
            if (savedUser.isOnlineStatus === true) {
              return res
                .json({
                  msg: "You Are Online",
                  savedUser: savedUser,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({
                  msg: "You Are Offline",
                  savedUser: savedUser,
                  success: true,
                })
                .status(200);
            }
          })
          .catch((err) => {
            console.log(err);
            return res.json({ msg: "Failed!", success: false }).status(505);
          });
      } else {
        return res
          .json({
            msg: "No Such User Exits!",
            foundUser: foundUser,
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

// Router.post("/count-total-followed-stores-of-specific-user", (req, res) => {
//   let { userID } = req.body;
//   UserStats.findOne({ user: userID })
//     .then(foundUser => {
//       if (foundUser) {
//         return res
//           .json({
//             msg: "Total followed stores",
//             total: foundUser.followedStores.length,
//             success: true
//           })
//           .status(200);
//       } else {
//         return res.json({ msg: "No Such User", success: false }).status(505);
//       }
//     })
//     .catch(err => {
//       console.log(err);
//       return res.json({ msg: "Failed!", success: false }).status(505);
//     });
// });

///////////register-user-with-image/////////////
Router.post(
  "/login-&-register-user-with-image-by-social-login",
  upload.array("userImages", 2),
  (req, res) => {
    let imageArrays = req.files;
    let { data } = req.body;
    // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
    let user = JSON.parse(data);
    // return res.json(user);
    // IMAGE URLS WILL BE CREATE BELOW
    let ImageURLsArray = [];
    imageArrays.forEach((eachFoundPic) => {
      ImageURLsArray.push(`/files/vendor-files/image/${eachFoundPic.filename}`);
    });
    let RegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let message = false;

    if (!RegularExpression.test(String(user.email).toLowerCase())) {
      message = "invalid email";
    } else if (ImageURLsArray.length < 1) {
      message = "One Image is compulsory!";
    } else {
      message = false;
    }
    if (message === false) {
      User.findOne({ email: user.email })
        .then((founduser) => {
          if (founduser !== null) {
            return res
              .json({
                msg: "User Authenticated!",
                founduser: founduser,
                success: true,
              })
              .status(200);
          } else {
            let newUser = new User({
              userName: user.userName,
              email: user.email,
              password: null,
              profileImgURL: ImageURLsArray,
            });
            newUser
              .save()
              .then((savedUser) => {
                if (savedUser) {
                  savedUser.password = "";
                  let newUserStats = new UserStats({
                    user: savedUser._id,
                  });
                  newUserStats.save().then((UserStatsSaved) => {
                    if (UserStatsSaved) {
                      return res
                        .json({
                          msg: "New User Registered!",
                          savedUser: savedUser,
                          success: true,
                        })
                        .status(200);
                    } else {
                      return res
                        .json({
                          msg: "User Stats Not Created!",
                          success: false,
                        })
                        .status(400);
                    }
                  });
                } else {
                  return res
                    .json({ msg: "User Not Save!", success: false })
                    .status(400);
                }
              })
              .catch((err) => {
                console.log(err);
                console.log("error found");
                return res
                  .json({
                    msg: "Failed: Save Catch Error!",
                    success: false,
                  })
                  .status(400);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          return res
            .json({ msg: "Catch Error: Found Email", success: false })
            .status(400);
        });
    } else {
      return res.json({ msg: message, success: false }).status(400);
    }
  }
);

/////////////remove-specific-user/////////////////
Router.post("/remove-specific-user", (req, res) => {
  let { userID } = req.body;
  User.remove({ _id: userID })
    .then((foundUser) => {
      if (foundUser.n === 1) {
        return res
          .json({
            msg: "User Deleted!",
            foundUser: userID,
            success: true,
          })
          .status(200);
      } else {
        return res.json({ msg: "Invalid ID!", success: false }).status(400);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(500);
    });
});

// //////////////////// add-new-password///////////////////////////////
Router.post("/add-new-password", (req, res) => {
  let { user } = req.body;
  if (user.email === "") {
    message = "Invalid Email";
  } else if (user.password === "") {
    message = "Invalid Password";
  } else {
    message = false;
  }
  if (message === false) {
    User.findOne({ email: user.email }).then((userFound) => {
      if (userFound) {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            return res
              .json({
                msg: "Salt Creation Failed!",
                success: false,
              })
              .status(400);
          }
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
              return res
                .json({ msg: "Hash Cration Failed!!!", success: false })
                .status(400);
            }
            userFound.password = hash;
            userFound
              .save()
              .then((saveduser) => {
                return res
                  .json({
                    msg: "user Found & Password Updated",
                    userName: saveduser.userName,
                    success: true,
                  })
                  .status(200);
              })
              .catch((err) => {
                console.log(err);
                return res
                  .json({
                    msg: "user Invalid!!!",
                    userPassword: saveduser.password,
                    success: false,
                  })
                  .status(500);
              });
          });
        });
      } else {
        return res.json({ msg: "user Not Found", success: false }).status(400);
      }
    });
  }
});

// //////////////////// Emailed Code Matched,Check and Change///////////////////////////////
Router.post("/forget-pass-code-match", (req, res) => {
  let { user } = req.body;
  let message = false;
  if (user.email === "") {
    message = "Invalid user's Email";
  } else if (user.randomcode === "") {
    message = "Invalid Code";
  } else {
    message = false;
  }
  if (message === false) {
    // const RandomNumber = randomize("0", 6);

    User.findOne({
      email: user.email,
      RandomNumber: user.randomcode,
    })
      .then((founduser) => {
        if (founduser !== null) {
          founduser.RandomNumber = null; //Change the code from dataBase
          founduser.save().then((Updateuser) => {
            console.log(Updateuser.RandomNumber);
            return res
              .json({
                msg: "user And Code Verified",
                success: true,
              })
              .status(200);
          });
        } else {
          return res
            .json({
              msg: "Invalid Email Or Code!!!!",
              success: false,
            })
            .status(400);
        }
      })
      .catch((err) => {
        return res.json({ msg: "Failed!", success: false }).status(500);
      });
  }
});

////////////////////Password Reset By Email////////step 1///////////////////////
Router.post("/forget-pass-send-email", (req, res) => {
  let { email } = req.body;
  const RandomNumber = randomize("0", 6);
  User.findOne({ email: email })
    .then((foundStore) => {
      if (foundStore !== null) {
        foundStore.RandomNumber = RandomNumber;
        foundStore
          .save()
          .then((SavedRandomNumber) => {
            if (SavedRandomNumber) {
              const mailOptions = {
                from: "mhanzlanaveed@gmail.com", // sender address
                to: email, // list of receivers
                subject: "Pinterest App Reset Code ✔", // Subject line
                html: `<p>Password Reset Code: </p> ${RandomNumber} `, // plain text body
              };
              // Email Sending Second Step
              transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                  console.log(err);
                  return res
                    .json({ msg: "Email Failed!", success: false })
                    .status(400);
                } else {
                  console.log(`Email Sent at ${email} `);
                  return res
                    .json({
                      msg: `Email Sent to ${foundStore.userName}`,

                      success: true,
                    })
                    .status(200);
                }
              }); // NODEMAILER END HERE
            } else {
              return res
                .json({ msg: "Random Code Not Saved", success: false })
                .status(400);
            }
            // Email Sending First Step Email Content
          })
          .catch((err) => {
            return res
              .json({ msg: "Code Not Saved In DATABASE", success: false })
              .status(400);
          });
      } else {
        return res
          .json({
            msg: "Invalid !!! ",
            success: false,
          })
          .status(400);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!!!", success: false }).status(500);
    });
});

////////////////SHOW all-users-details//////
Router.post("/all-users-details", (req, res) => {
  User.find()
    .then((foundUsers) => {
      if (foundUsers.length > 0) {
        return res
          .json({
            msg: "All Users Details!",
            foundUsers: foundUsers,
            success: true,
          })
          .status(200);
      } else {
        return res.json({ msg: "No User!", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(500);
    });
});

// ////////////////SHOW SINGLE user DETAILS//////
Router.post("/single-user-details", (req, res) => {
  let { userID } = req.body;

  User.findOne({ _id: userID })
    .then((founduser) => {
      if (founduser !== null) {
        return res
          .json({ msg: "user Found!", founduser: founduser, success: true })
          .status(200);
      } else {
        return res.json({ msg: "user Not Found!", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(500);
    });
});

// //user LOG IN API
Router.post("/user-login", (req, res) => {
  let { user } = req.body;

  /////Validations Starts Here
  let RegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let message = false;
  if (user.password === "" && user.password.length < 6) {
    message = "invalid password";
  } else if (!RegularExpression.test(String(user.email).toLowerCase())) {
    message = "invalid email";
  } else {
    message = false;
  }
  if (message === false) {
    User.findOne({ email: user.email })
      .then((founduser) => {
        if (founduser) {
          ///////////// Password Compare /////////
          bcrypt
            .compare(user.password, founduser.password)
            .then((checkPwMatch) => {
              if (checkPwMatch) {
                founduser.password = "";
                return res
                  .json({
                    msg: "Authenticated user!",
                    user: founduser,
                    success: true,
                  })
                  .status(200);
              } else {
                return res
                  .json({ msg: "Invalid Password", success: false })
                  .status(400);
              }
            })
            .catch((err) => {
              console.log(err);
              return res
                .json({
                  msg: "catch error password comparison",
                  success: false,
                })
                .status(400);
            });
        } else {
          return res.json({ msg: "Invalid Email", success: false }).status(400);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "catch error ", success: false }).status(500);
      });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
}); //user LOGIN API ENDS

// // ///////////update-profile-image/////////////
// Router.post(
//   "/update-profile-image",
//   upload.array("userImages", 2),
//   (req, res) => {
//     let imageArrays = req.files;
//     let { data } = req.body;
//     // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
//     let user = JSON.parse(data);
//     // return res.json(user);
//     // IMAGE URLS WILL BE CREATE BELOW
//     let ImageURLsArray = [];
//     imageArrays.forEach(eachFoundPic => {
//       ImageURLsArray.push(`/files/vendor-files/image/${eachFoundPic.filename}`);
//     });
//     //VALIDATIONS STARTS HERE
//     let message = false;
//     if (user._id === "") {
//       message = "invalid _id";
//     } else {
//       message = false;
//     }
//     if (message === false) {
//       //   let { _id:store._id}=req.body;

//       User.findOne({
//         _id: user._id
//         // $or: [{ email: store.email }, { storeName: store.storeName }]
//       })
//         .then(foundUser => {
//           if (foundUser !== null) {
//             if (ImageURLsArray.length >= 2) {
//               return res
//                 .json({
//                   msg: "Only One Profile Image Allowed!",
//                   success: false
//                 })
//                 .status(400);
//             }
//             foundUser.profileImgURL = ImageURLsArray;
//             foundUser
//               .save()
//               .then(UserUpdated => {
//                 if (UserUpdated) {
//                   UserUpdated.password = "";
//                   return res
//                     .json({
//                       msg: "User Updated!",
//                       success: true
//                     })
//                     .status(200);
//                 } else {
//                   return res
//                     .json({ msg: "User Not Save!", success: false })
//                     .status(400);
//                 }
//               })
//               .catch(err => {
//                 console.log(err);
//                 console.log("error found");
//                 return res
//                   .json({
//                     msg: "Failed: Save Catch Error!",
//                     success: false
//                   })
//                   .status(400);
//               });
//           }
//         })
//         .catch(err => {
//           console.log(err);
//           return res
//             .json({ msg: "Catch Error: Found Email", success: false })
//             .status(400);
//         });
//     } else {
//       return res.json({ msg: message, success: false }).status(400);
//     }
//   }
// );

// /////////////////////////
// Router.post("/update-user-details", (req, res) => {
//   let { user } = req.body;
//   let message = false;
//   if (user.userName === "") {
//     message = "invalid userName";
//   }
//   if (message === false) {
//     User.findOne({ _id: user._id })
//       .then(foundUser => {
//         if (foundUser) {
//           foundUser.userName = user.userName;
//           // foundUser.phoneNumber = user.phoneNumber;
//           // foundUser.address = user.address;
//           foundUser.save().then(saveduser => {
//             if (saveduser) {
//               saveduser.password = "";
//               return res
//                 .json({
//                   msg: "user Updated",
//                   saveduser: saveduser,
//                   success: true
//                 })
//                 .status(200);
//             } else {
//               return res.json({ msg: "Not Saved", success: false }).status(400);
//             }
//           });
//         } else {
//           return res.json({ msg: "Not Found", success: false }).status(400);
//         }
//       })
//       .catch(err => {
//         return res.json({ msg: "Failed!", success: false }).status(500);
//       });
//   } else {
//     return res.json({ msg: message, success: false }).status(400);
//   }
// });
///////////register-user-with-image/////////////
Router.post(
  "/update-user-with-image",
  upload.array("userImages", 2),
  (req, res) => {
    let imageArrays = req.files;
    let { data } = req.body;
    // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
    let user = JSON.parse(data);
    // IMAGE URLS WILL BE CREATE BELOW
    let ImageURLsArray = [];
    imageArrays.forEach((eachFoundPic) => {
      ImageURLsArray.push(`/files/vendor-files/image/${eachFoundPic.filename}`);
    });
    //VALIDATIONS STARTS HERE
    let message = false;
    if (user.userName === "") {
      message = "invalid userName";
    }
    // else if (store.phoneNumber === "" && store.phoneNumber.length < 6) {
    //   message = "invalid phoneNumber";
    // }

    //  else if (store.address === "") {
    //   message = "invalid address";
    // }
    else {
      message = false;
    }
    if (message === false) {
      User.findOne({ _id: user._id })
        .then((founduser) => {
          if (founduser !== null) {
            founduser.userName = user.userName;
            founduser.dateOfBirth = user.dateOfBirth;
            founduser.state = user.state;
            founduser.email = founduser.email; //same
            founduser.gender = user.gender;
            founduser.country = user.country;
            founduser.password = founduser.password; //same
            founduser.profileImgURL = founduser.profileImgURL;
            if (ImageURLsArray.length > 0) {
              founduser.profileImgURL = ImageURLsArray;
            }
            founduser
              .save()
              .then((userUpdated) => {
                if (userUpdated) {
                  return res
                    .json({
                      msg: "User Updated!",
                      userUpdated: userUpdated,
                      success: true,
                    })
                    .status(200);
                  // savedUser.password = "";
                  // let newUserStats = new UserStats({
                  //   user: savedUser._id
                  // });
                  // newUserStats.save().then(UserStatsSaved => {
                  //   if (UserStatsSaved) {

                  //   } else {
                  //     return res
                  //       .json({
                  //         msg: "User Stats Not Created!",
                  //         success: false
                  //       })
                  //       .status(400);
                  //   }
                  // });
                } else {
                  return res
                    .json({ msg: "User Not Save!", success: false })
                    .status(400);
                }
              })
              .catch((err) => {
                console.log(err);
                console.log("error found");
                return res
                  .json({
                    msg: "Failed: Save Catch Error!",
                    success: false,
                  })
                  .status(400);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          return res
            .json({ msg: "Catch Error: Found Email", success: false })
            .status(400);
        });
    } else {
      return res.json({ msg: message, success: false }).status(400);
    }
  }
);
///////////register-user-with-image/////////////
Router.post(
  "/login-or-register-user-with-image-by-social-media",
  upload.array("userImages", 2),
  (req, res) => {
    let imageArrays = req.files;
    let { data } = req.body;
    // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
    let user = JSON.parse(data);
    // IMAGE URLS WILL BE CREATE BELOW
    let ImageURLsArray = [];
    imageArrays.forEach((eachFoundPic) => {
      ImageURLsArray.push(`/files/vendor-files/image/${eachFoundPic.filename}`);
    });
    //VALIDATIONS STARTS HERE
    let RegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let message = false;
    // if (user.userName === "") {
    //   message = "invalid userName";
    // }
    // // else if (store.phoneNumber === "" && store.phoneNumber.length < 6) {
    // //   message = "invalid phoneNumber";
    // // }
    // else
    // if (user.password === "" && user.password.length < 6) {
    //   message = "invalid password";
    // } else
    if (!RegularExpression.test(String(user.email).toLowerCase())) {
      message = "invalid email";
    }
    //  else if (store.address === "") {
    //   message = "invalid address";
    // }
    // else if (ImageURLsArray.length < 1) {
    //   message = "One Image is compulsory!";
    // }
    // else {
    //   message = false;
    // }
    if (message === false) {
      User.findOne({
        $or: [{ email: user.email }, { userName: user.storeName }],
      })
        .then((founduser) => {
          if (founduser !== null) {
            if (founduser.email === user.email) {
              return res
                .json({ msg: "User Authenticated!", success: true })
                .status(400);
            }
          } else {
            let newUser = new User({
              userName: user.userName,
              dateOfBirth: user.dateOfBirth,
              state: user.state,
              email: user.email,
              gender: user.gender,
              country: user.country,
              //   phoneNumber: user.phoneNumber,
              password: null,
              // address: user.address,
              profileImgURL: ImageURLsArray,
            });
            newUser
              .save()
              .then((savedUser) => {
                if (savedUser) {
                  return res
                    .json({
                      msg: "New User Registered!",
                      savedUser: savedUser,
                      success: true,
                    })
                    .status(200);
                  // savedUser.password = "";
                  // let newUserStats = new UserStats({
                  //   user: savedUser._id
                  // });
                  // newUserStats.save().then(UserStatsSaved => {
                  //   if (UserStatsSaved) {

                  //   } else {
                  //     return res
                  //       .json({
                  //         msg: "User Stats Not Created!",
                  //         success: false
                  //       })
                  //       .status(400);
                  //   }
                  // });
                } else {
                  return res
                    .json({ msg: "User Not Save!", success: false })
                    .status(400);
                }
              })
              .catch((err) => {
                console.log(err);
                console.log("error found");
                return res
                  .json({
                    msg: "Failed: Save Catch Error!",
                    success: false,
                  })
                  .status(400);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          return res
            .json({ msg: "Catch Error: Found Email", success: false })
            .status(400);
        });
    } else {
      return res.json({ msg: message, success: false }).status(400);
    }
  }
);
///////////register-user-with-image/////////////
Router.post(
  "/register-user-with-image",
  upload.array("userImages", 2),
  (req, res) => {
    let imageArrays = req.files;
    let { data } = req.body;
    // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
    let user = JSON.parse(data);
    // IMAGE URLS WILL BE CREATE BELOW
    let ImageURLsArray = [];
    imageArrays.forEach((eachFoundPic) => {
      ImageURLsArray.push(`/files/vendor-files/image/${eachFoundPic.filename}`);
    });
    //VALIDATIONS STARTS HERE
    let RegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let message = false;
    if (user.userName === "") {
      message = "invalid userName";
    }
    // else if (store.phoneNumber === "" && store.phoneNumber.length < 6) {
    //   message = "invalid phoneNumber";
    // }
    else if (user.password === "" && user.password.length < 6) {
      message = "invalid password";
    } else if (!RegularExpression.test(String(user.email).toLowerCase())) {
      message = "invalid email";
    }
    //  else if (store.address === "") {
    //   message = "invalid address";
    // }
    else if (ImageURLsArray.length < 1) {
      message = "One Image is compulsory!";
    } else {
      message = false;
    }
    if (message === false) {
      User.findOne({
        $or: [{ email: user.email }, { userName: user.storeName }],
      })
        .then((founduser) => {
          if (founduser !== null) {
            if (founduser.email === user.email) {
              return res
                .json({ msg: "Email Already Exist!", success: false })
                .status(400);
            } else if (founduser.userName === user.userName) {
              return res
                .json({ msg: "userName Already Exist!", success: false })
                .status(400);
            }
          } else {
            bcrypt.genSalt(10, (err, salt) => {
              // Generate Salt Here
              if (err) {
                return res
                  .json({ msg: "salt creation failed!", success: false })
                  .status(400);
              }
              bcrypt.hash(user.password, salt, (err, hash) => {
                // Generate Hash Here
                if (err) {
                  return res
                    .json({ msg: "hash creation failed!", success: false })
                    .status(400);
                }
                let newUser = new User({
                  userName: user.userName,
                  dateOfBirth: user.dateOfBirth,
                  state: user.state,
                  email: user.email,
                  gender: user.gender,
                  country: user.country,
                  //   phoneNumber: user.phoneNumber,
                  password: hash,
                  // address: user.address,
                  profileImgURL: ImageURLsArray,
                });
                newUser
                  .save()
                  .then((savedUser) => {
                    if (savedUser) {
                      return res
                        .json({
                          msg: "New User Registered!",
                          savedUser: savedUser,
                          success: true,
                        })
                        .status(200);
                      // savedUser.password = "";
                      // let newUserStats = new UserStats({
                      //   user: savedUser._id
                      // });
                      // newUserStats.save().then(UserStatsSaved => {
                      //   if (UserStatsSaved) {

                      //   } else {
                      //     return res
                      //       .json({
                      //         msg: "User Stats Not Created!",
                      //         success: false
                      //       })
                      //       .status(400);
                      //   }
                      // });
                    } else {
                      return res
                        .json({ msg: "User Not Save!", success: false })
                        .status(400);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    console.log("error found");
                    return res
                      .json({
                        msg: "Failed: Save Catch Error!",
                        success: false,
                      })
                      .status(400);
                  });
              });
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return res
            .json({ msg: "Catch Error: Found Email", success: false })
            .status(400);
        });
    } else {
      return res.json({ msg: message, success: false }).status(400);
    }
  }
);
module.exports = Router;
