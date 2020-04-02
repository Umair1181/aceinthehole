const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const ProductPostClass = require("../BusinessLogic/user");

const {
  User,
  UserStats,
  ProductPost,
  Store,
  StoreStats
} = require("../../MODELS");
const { upload } = require("../../storage")();
///email send import
const randomize = require("randomatic");
const transporter = require("../emailSend");

Router.post("/count-total-followed-stores-of-specific-user", (req, res) => {
  let { userID } = req.body;
  UserStats.findOne({ user: userID })
    .then(foundUser => {
      if (foundUser) {
        return res
          .json({
            msg: "Total followed stores",
            total: foundUser.followedStores.length,
            success: true
          })
          .status(200);
      } else {
        return res.json({ msg: "No Such User", success: false }).status(505);
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

// ////////////////SHOW SINGLE user DETAILS//////
Router.post("/list-of-all-followed-stores-by-user", (req, res) => {
  let { userID } = req.body;

  UserStats.findOne({ user: userID })
    .populate({ path: "followedStores" })
    .then(founduserStat => {
      if (founduserStat !== null) {
        return res
          .json({
            msg: "user follow these stores!",
            followedStores: founduserStat.followedStores,
            success: true
          })
          .status(200);
      } else {
        return res.json({ msg: "stat Not Found!", success: false }).status(404);
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(500);
    });
});

Router.post("/show-users-app-share", (req, res) => {
  let { userID } = req.body;

  UserStats.findOne({ user: userID })
    .then(async foundUserStat => {
      if (foundUserStat) {
        return res
          .json({
            msg: "Total App Shares of User",
            totalAppShares: foundUserStat.totalUserAppShares,
            success: true
          })
          .status(200);
      } else {
        return res
          .json({ msg: "No Such User Stats Exist", success: false })
          .status(400);
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(500);
    });

  // else {
  //   UserStats.update({ user: userID }, { $pull: { likedPosts: postID } }).then(
  //     async storeUnfollowed => {
  //       let foundPost = await ProductPost.findOne({ _id: postID });
  //       if (foundPost) {
  //         foundPost.totalLikes = foundPost.totalLikes - 1;
  //         let savedincrement = await foundPost.save();
  //         if (savedincrement) {
  //           console.log("Saved decrement");
  //         }

  //         if (storeUnfollowed) {
  //           let foundStat = await UserStats.findOne({ user: userID });
  //           return res
  //             .json({
  //               msg: "storeUnfollowed",
  //               foundPost,
  //               foundStat,
  //               success: true
  //             })
  //             .status(200);
  //         }
  //       } else {
  //         return res
  //           .json({
  //             msg: "Not storeUnfollowed",
  //             storeUnfollowed,
  //             success: false
  //           })
  //           .status(400);
  //       }
  //     }
  //   );
  // }
});
Router.post("/share-app-by-user", (req, res) => {
  let { userID } = req.body;

  UserStats.findOne({ user: userID })
    .then(async foundUserStat => {
      if (foundUserStat) {
        foundUserStat.totalUserAppShares = foundUserStat.totalUserAppShares + 1;
        foundUserStat
          .save()
          .then(storeSharedSaved => {
            if (storeSharedSaved) {
              return res
                .json({
                  msg: "Store Shared!",
                  storeSharedSaved: storeSharedSaved,
                  success: true
                })
                .status(200);
            } else {
              return res
                .json({ msg: "Store Not Shared!", success: false })
                .status(200);
            }
          })
          .catch(err => {
            console.log(err);
            return res.json({ msg: "Failed!", success: false }).status(500);
          });
      } else {
        return res
          .json({ msg: "No Such User Stats Exist", success: false })
          .status(400);
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(500);
    });

  // else {
  //   UserStats.update({ user: userID }, { $pull: { likedPosts: postID } }).then(
  //     async storeUnfollowed => {
  //       let foundPost = await ProductPost.findOne({ _id: postID });
  //       if (foundPost) {
  //         foundPost.totalLikes = foundPost.totalLikes - 1;
  //         let savedincrement = await foundPost.save();
  //         if (savedincrement) {
  //           console.log("Saved decrement");
  //         }

  //         if (storeUnfollowed) {
  //           let foundStat = await UserStats.findOne({ user: userID });
  //           return res
  //             .json({
  //               msg: "storeUnfollowed",
  //               foundPost,
  //               foundStat,
  //               success: true
  //             })
  //             .status(200);
  //         }
  //       } else {
  //         return res
  //           .json({
  //             msg: "Not storeUnfollowed",
  //             storeUnfollowed,
  //             success: false
  //           })
  //           .status(400);
  //       }
  //     }
  //   );
  // }
});

Router.post("/share-post-by-user", (req, res) => {
  let { userID, postID } = req.body;

  UserStats.findOne({ user: userID })
    .then(async foundUserStat => {
      if (foundUserStat) {
        foundUserStat.sharedPosts.push(postID);
        let foundPost = await ProductPost.findOne({ _id: postID });
        if (foundPost) {
          foundPost.totalShares = foundPost.totalShares + 1;
          let savedincrement = await foundPost.save();
          if (savedincrement) {
            console.log("Saved increment");
          }
        }
        foundUserStat.save().then(storeFollowedSaved => {
          if (storeFollowedSaved) {
            return res
              .json({
                msg: "Post Like and Saved!",
                foundPost,
                storeFollowedSaved: storeFollowedSaved,
                success: true
              })
              .status(200);
          } else {
            return res
              .json({ msg: "Post Like Not Saved!", success: false })
              .status(200);
          }
        });
      } else {
        return res
          .json({ msg: "No Such User Stats Exist", success: false })
          .status(400);
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(500);
    });

  // else {
  //   UserStats.update({ user: userID }, { $pull: { likedPosts: postID } }).then(
  //     async storeUnfollowed => {
  //       let foundPost = await ProductPost.findOne({ _id: postID });
  //       if (foundPost) {
  //         foundPost.totalLikes = foundPost.totalLikes - 1;
  //         let savedincrement = await foundPost.save();
  //         if (savedincrement) {
  //           console.log("Saved decrement");
  //         }

  //         if (storeUnfollowed) {
  //           let foundStat = await UserStats.findOne({ user: userID });
  //           return res
  //             .json({
  //               msg: "storeUnfollowed",
  //               foundPost,
  //               foundStat,
  //               success: true
  //             })
  //             .status(200);
  //         }
  //       } else {
  //         return res
  //           .json({
  //             msg: "Not storeUnfollowed",
  //             storeUnfollowed,
  //             success: false
  //           })
  //           .status(400);
  //       }
  //     }
  //   );
  // }
});

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
    imageArrays.forEach(eachFoundPic => {
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
        .then(founduser => {
          if (founduser !== null) {
            return res
              .json({
                msg: "User Authenticated!",
                founduser: founduser,
                success: true
              })
              .status(200);
          } else {
            let newUser = new User({
              userName: user.userName,
              email: user.email,
              password: null,
              profileImgURL: ImageURLsArray
            });
            newUser
              .save()
              .then(savedUser => {
                if (savedUser) {
                  savedUser.password = "";
                  let newUserStats = new UserStats({
                    user: savedUser._id
                  });
                  newUserStats.save().then(UserStatsSaved => {
                    if (UserStatsSaved) {
                      return res
                        .json({
                          msg: "New User Registered!",
                          savedseller: savedUser,
                          success: true
                        })
                        .status(200);
                    } else {
                      return res
                        .json({
                          msg: "User Stats Not Created!",
                          success: false
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
              .catch(err => {
                console.log(err);
                console.log("error found");
                return res
                  .json({
                    msg: "Failed: Save Catch Error!",
                    success: false
                  })
                  .status(400);
              });
          }
        })
        .catch(err => {
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

Router.post("/liked-disLiked-products-of-any-user", async (req, res) => {
  let { userID, limit, offset } = req.body;
  UserStats.findOne({ user: userID })
    .then(foundUserStat => {
      ProductPost.find()
        // .sort({ totalLikes: -1 })
        .limit(limit)
        .skip(offset)
        .then(async allProducts => {
          // neow let me see
          // return res.json ({ list: allProducts, list2: foundUserStat });
          new ProductPostClass()
            .checkIsLikedOrNot(allProducts, foundUserStat.likedPosts)
            .then(result => {
              if (result.length > 0) {
                return res
                  .json({
                    msg: "All Liked and Disliked Products",
                    allLikedCHeckedPro: result,
                    success: true
                  })
                  .status(200);
              } else {
                return res
                  .json({ msg: "No Result!", success: false })
                  .status(404);
              }
            });
        })
        .catch(err => {
          console.log(err);
          console.log("Catch error of finding product posts");
        });
    })
    .catch(err => {
      console.log(err);
      console.log("Catch error of finding user stats form userStat");
    });
});

// ////////////////SHOW SINGLE user DETAILS//////
Router.post("/single-user-stat", (req, res) => {
  let { userID } = req.body;

  UserStats.findOne({ user: userID })
    .populate({ path: "followedStores" })
    .then(founduserStat => {
      if (founduserStat !== null) {
        return res
          .json({
            msg: "user stat Found!",
            founduserStat: founduserStat,
            success: true
          })
          .status(200);
      } else {
        return res.json({ msg: "stat Not Found!", success: false }).status(404);
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(500);
    });
});

/////////////remove-specific-user/////////////////
Router.post("/remove-specific-user", (req, res) => {
  let { userID } = req.body;
  User.remove({ _id: userID })
    .then(foundUser => {
      if (foundUser.n === 1) {
        return res
          .json({
            msg: "User Deleted!",
            foundUser: userID,
            success: true
          })
          .status(200);
      } else {
        return res.json({ msg: "Invalid ID!", success: false }).status(400);
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(500);
    });
});

Router.post("/store-follow-unfollow-by-user", async (req, res) => {
  let { userID, storeID, wantfollowOrUnFollow } = req.body;
  if (wantfollowOrUnFollow === true) {
    let foundStoreStat = await StoreStats.findOne({ store: storeID });
    for (let y = 0; y < foundStoreStat.followers.length; y++) {
      // return res.json(foundStoreStat.followers[y]);
      if (foundStoreStat.followers[y].toString() === userID.toString()) {
        return res
          .json({ msg: "Already Followed", success: false })
          .status(404);
      }
    }
    console.log("next to loop");
    foundStoreStat.followers.push(userID);
    let savedStoreStat = await foundStoreStat.save();
    if (!savedStoreStat) {
      return res
        .json({ msg: "Store Stat Not Saved!", success: false })
        .status(400);
    }
    console.log(savedStoreStat);
    let foundStore = await Store.findOne({ _id: storeID });

    if (foundStore) {
      foundStore.totalFollowers = foundStore.totalFollowers + 1;
      let storeSaved = await foundStore.save();
      if (storeSaved) {
        console.log("Store Saved and and one follower incremented!");
      }
    }

    UserStats.findOne({ user: userID })
      .then(foundUserStat => {
        if (foundUserStat) {
          foundUserStat.followedStores.push(storeID);
          foundUserStat.save().then(storeFollowedSaved => {
            if (storeFollowedSaved) {
              return res
                .json({
                  msg: "Store Followed and Saved!",
                  savedStoreStat,
                  foundStore,
                  storeFollowedSaved: storeFollowedSaved,
                  success: true
                })
                .status(200);
            } else {
              return res
                .json({ msg: "Store Follow  Not Saved!", success: false })
                .status(200);
            }
          });
        } else {
          return res
            .json({ msg: "No Such User Stats Exist", success: false })
            .status(400);
        }
      })
      .catch(err => {
        console.log(err);
        return res.json({ msg: "Failed!", success: false }).status(500);
      });
  } else {
    let foundStore = await Store.findOne({ _id: storeID });

    if (foundStore) {
      foundStore.totalFollowers = foundStore.totalFollowers - 1;
      let storeSaved = await foundStore.save();
      if (storeSaved) {
        console.log("Store Saved and and one follower decremented!");
      }
    }
    /////////////
    StoreStats.update(
      { store: storeID },
      { $pull: { followers: userID } }
    ).then(async storeUnfollowed => {
      if (storeUnfollowed) {
        UserStats.update(
          { user: userID },
          { $pull: { followedStores: storeID } }
        ).then(async storeUnfollowed => {
          if (storeUnfollowed) {
            let foundStat = await UserStats.findOne({ user: userID });
            return res
              .json({
                msg: "storeUnfollowed",
                foundStore,
                foundStat,
                success: true
              })
              .status(200);
          } else {
            return res
              .json({
                msg: "Not storeUnfollowed",
                storeUnfollowed,
                success: false
              })
              .status(400);
          }
        });
        // let foundStat = await UserStats.findOne({ user: userID });
        // return res
        //   .json({
        //     msg: "storeUnfollowed",
        //     foundStore,
        //     foundStat,
        //     success: true
        //   })
        //   .status(200);
      } else {
        return res
          .json({ msg: "Not storeUnfollowed", storeUnfollowed, success: false })
          .status(400);
      }
    });

    ////////
  }
});

Router.post("/post-liked-disliked-by-user", (req, res) => {
  let { userID, postID, wantAddOrRemove } = req.body;

  if (wantAddOrRemove === true) {
    UserStats.findOne({ user: userID })
      .then(async foundUserStat => {
        if (foundUserStat) {
          foundUserStat.likedPosts.push(postID);
          let foundPost = await ProductPost.findOne({ _id: postID });
          if (foundPost) {
            foundPost.totalLikes = foundPost.totalLikes + 1;
            let savedincrement = await foundPost.save();
            if (savedincrement) {
              console.log("Saved increment");
            }
          }
          foundUserStat.save().then(storeFollowedSaved => {
            if (storeFollowedSaved) {
              return res
                .json({
                  msg: "Post Like and Saved!",
                  foundPost,
                  storeFollowedSaved: storeFollowedSaved,
                  success: true
                })
                .status(200);
            } else {
              return res
                .json({ msg: "Post Like Not Saved!", success: false })
                .status(200);
            }
          });
        } else {
          return res
            .json({ msg: "No Such User Stats Exist", success: false })
            .status(400);
        }
      })
      .catch(err => {
        console.log(err);
        return res.json({ msg: "Failed!", success: false }).status(500);
      });
  } else {
    UserStats.update({ user: userID }, { $pull: { likedPosts: postID } }).then(
      async storeUnfollowed => {
        let foundPost = await ProductPost.findOne({ _id: postID });
        if (foundPost) {
          foundPost.totalLikes = foundPost.totalLikes - 1;
          let savedincrement = await foundPost.save();
          if (savedincrement) {
            console.log("Saved decrement");
          }

          if (storeUnfollowed) {
            let foundStat = await UserStats.findOne({ user: userID });
            return res
              .json({
                msg: "storeUnfollowed",
                foundPost,
                foundStat,
                success: true
              })
              .status(200);
          }
        } else {
          return res
            .json({
              msg: "Not storeUnfollowed",
              storeUnfollowed,
              success: false
            })
            .status(400);
        }
      }
    );
  }
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
    User.findOne({ email: user.email }).then(userFound => {
      if (userFound) {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            return res
              .json({
                msg: "Salt Creation Failed!",
                success: false
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
              .then(saveduser => {
                return res
                  .json({
                    msg: "user Found & Password Updated",
                    userName: saveduser.userName,
                    success: true
                  })
                  .status(200);
              })
              .catch(err => {
                console.log(err);
                return res
                  .json({
                    msg: "user Invalid!!!",
                    userPassword: saveduser.password,
                    success: false
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
      RandomNumber: user.randomcode
    })
      .then(founduser => {
        if (founduser !== null) {
          founduser.RandomNumber = null; //Change the code from dataBase
          founduser.save().then(Updateuser => {
            console.log(Updateuser.RandomNumber);
            return res
              .json({
                msg: "user And Code Verified",
                success: true
              })
              .status(200);
          });
        } else {
          return res
            .json({
              msg: "Invalid Email Or Code!!!!",
              success: false
            })
            .status(400);
        }
      })
      .catch(err => {
        return res.json({ msg: "Failed!", success: false }).status(500);
      });
  }
});

////////////////////Password Reset By Email////////step 1///////////////////////
Router.post("/forget-pass-send-email", (req, res) => {
  let { email } = req.body;
  const RandomNumber = randomize("0", 6);
  User.findOne({ email: email })
    .then(foundStore => {
      if (foundStore !== null) {
        foundStore.RandomNumber = RandomNumber;
        foundStore
          .save()
          .then(SavedRandomNumber => {
            if (SavedRandomNumber) {
              const mailOptions = {
                from: "mhanzlanaveed@gmail.com", // sender address
                to: email, // list of receivers
                subject: "Pinterest App Reset Code ✔", // Subject line
                html: `<p>Password Reset Code: </p> ${RandomNumber} ` // plain text body
              };
              // Email Sending Second Step
              transporter.sendMail(mailOptions, function(err, info) {
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

                      success: true
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
          .catch(err => {
            return res
              .json({ msg: "Code Not Saved In DATABASE", success: false })
              .status(400);
          });
      } else {
        return res
          .json({
            msg: "Seller Not Exist !!! ",
            success: false
          })
          .status(400);
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ msg: "Failed!!!", success: false }).status(500);
    });
});

////////////////SHOW all-users-details//////
Router.post("/all-users-details", (req, res) => {
  User.find()
    .then(foundUsers => {
      if (foundUsers.length > 0) {
        return res
          .json({
            msg: "All Users Details!",
            foundUsers: foundUsers,
            success: true
          })
          .status(200);
      } else {
        return res.json({ msg: "No User!", success: false }).status(404);
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(500);
    });
});

// ////////////////SHOW SINGLE user DETAILS//////
Router.post("/single-user-details", (req, res) => {
  let { userID } = req.body;

  User.findOne({ _id: userID })
    .then(founduser => {
      if (founduser !== null) {
        return res
          .json({ msg: "user Found!", founduser: founduser, success: true })
          .status(200);
      } else {
        return res.json({ msg: "user Not Found!", success: false }).status(404);
      }
    })
    .catch(err => {
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
      .then(founduser => {
        if (founduser) {
          ///////////// Password Compare /////////
          bcrypt
            .compare(user.password, founduser.password)
            .then(checkPwMatch => {
              if (checkPwMatch) {
                founduser.password = "";
                return res
                  .json({
                    msg: "Authenticated user!",
                    user: founduser,
                    success: true
                  })
                  .status(200);
              } else {
                return res
                  .json({ msg: "Invalid Password", success: false })
                  .status(400);
              }
            })
            .catch(err => {
              console.log(err);
              return res
                .json({
                  msg: "catch error password comparison",
                  success: false
                })
                .status(400);
            });
        } else {
          return res.json({ msg: "Invalid Email", success: false }).status(400);
        }
      })
      .catch(err => {
        console.log(err);
        return res.json({ msg: "catch error ", success: false }).status(500);
      });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
}); //user LOGIN API ENDS

// ///////////update-profile-image/////////////
Router.post(
  "/update-profile-image",
  upload.array("userImages", 2),
  (req, res) => {
    let imageArrays = req.files;
    let { data } = req.body;
    // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
    let user = JSON.parse(data);
    // return res.json(user);
    // IMAGE URLS WILL BE CREATE BELOW
    let ImageURLsArray = [];
    imageArrays.forEach(eachFoundPic => {
      ImageURLsArray.push(`/files/vendor-files/image/${eachFoundPic.filename}`);
    });
    //VALIDATIONS STARTS HERE
    let message = false;
    if (user._id === "") {
      message = "invalid _id";
    } else {
      message = false;
    }
    if (message === false) {
      // return res.json(seller);
      //   let { _id:store._id}=req.body;

      User.findOne({
        _id: user._id
        // $or: [{ email: store.email }, { storeName: store.storeName }]
      })
        .then(foundUser => {
          if (foundUser !== null) {
            if (ImageURLsArray.length >= 2) {
              return res
                .json({
                  msg: "Only One Profile Image Allowed!",
                  success: false
                })
                .status(400);
            }
            foundUser.profileImgURL = ImageURLsArray;
            foundUser
              .save()
              .then(UserUpdated => {
                if (UserUpdated) {
                  UserUpdated.password = "";
                  return res
                    .json({
                      msg: "User Updated!",
                      savedseller: UserUpdated,
                      success: true
                    })
                    .status(200);
                } else {
                  return res
                    .json({ msg: "User Not Save!", success: false })
                    .status(400);
                }
              })
              .catch(err => {
                console.log(err);
                console.log("error found");
                return res
                  .json({
                    msg: "Failed: Save Catch Error!",
                    success: false
                  })
                  .status(400);
              });
          }
        })
        .catch(err => {
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

/////////////////////////
Router.post("/update-user-details", (req, res) => {
  let { user } = req.body;
  let message = false;
  if (user.userName === "") {
    message = "invalid userName";
  }
  if (message === false) {
    User.findOne({ _id: user._id })
      .then(foundUser => {
        if (foundUser) {
          foundUser.userName = user.userName;
          // foundUser.phoneNumber = user.phoneNumber;
          // foundUser.address = user.address;
          foundUser.save().then(saveduser => {
            if (saveduser) {
              saveduser.password = "";
              return res
                .json({
                  msg: "user Updated",
                  saveduser: saveduser,
                  success: true
                })
                .status(200);
            } else {
              return res.json({ msg: "Not Saved", success: false }).status(400);
            }
          });
        } else {
          return res.json({ msg: "Not Found", success: false }).status(400);
        }
      })
      .catch(err => {
        return res.json({ msg: "Failed!", success: false }).status(500);
      });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
});
///////////register-user-with-image/////////////
Router.post(
  "/register-user-with-image",
  upload.array("userImages", 2),
  (req, res) => {
    let imageArrays = req.files;
    let { data } = req.body;
    // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
    let user = JSON.parse(data);
    // return res.json(user);
    // IMAGE URLS WILL BE CREATE BELOW
    let ImageURLsArray = [];
    imageArrays.forEach(eachFoundPic => {
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
      // return res.json(seller);

      User.findOne({
        $or: [{ email: user.email }, { userName: user.storeName }]
      })
        .then(founduser => {
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
                  email: user.email,
                  //   phoneNumber: user.phoneNumber,
                  password: hash,
                  // address: user.address,
                  profileImgURL: ImageURLsArray
                });
                newUser
                  .save()
                  .then(savedUser => {
                    if (savedUser) {
                      savedUser.password = "";
                      let newUserStats = new UserStats({
                        user: savedUser._id
                      });
                      newUserStats.save().then(UserStatsSaved => {
                        if (UserStatsSaved) {
                          return res
                            .json({
                              msg: "New User Registered!",
                              savedseller: savedUser,
                              success: true
                            })
                            .status(200);
                        } else {
                          return res
                            .json({
                              msg: "User Stats Not Created!",
                              success: false
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
                  .catch(err => {
                    console.log(err);
                    console.log("error found");
                    return res
                      .json({
                        msg: "Failed: Save Catch Error!",
                        success: false
                      })
                      .status(400);
                  });
              });
            });
          }
        })
        .catch(err => {
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
