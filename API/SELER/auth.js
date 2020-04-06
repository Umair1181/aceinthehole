const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const { Seller, EmailVerification, Service } = require("../../MODELS");
const { upload, CreateURL } = require("../../storage")();

const randomize = require("randomatic");
const transporter = require("../emailSend");

Router.post("/all-services-of-specific-seller", (req, res) => {
  let { sellerID } = req.body;
  Service.find({ seller: sellerID })
    .then((foundServices) => {
      if (foundServices.length > 0) {
        return res
          .json({
            msg: "all-services-of-specific-seller!",
            foundServices: foundServices,
            success: true,
          })
          .status(200);
      } else {
        return res.json({ msg: "No Service", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/show-certificates-of-specific-service", (req, res) => {
  let { serviceID } = req.body;

  Service.findOne({ _id: serviceID })
    .then((foundService) => {
      if (foundService) {
        return res
          .json({
            msg: "All certificates in this serivce",
            certificates: foundService.certificatesImgsURLs,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({ msg: "No Certificate found!", success: false })
          .status(505);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/seller-online-offline-toggle", (req, res) => {
  let { sellerID } = req.body;
  Seller.findOne({ _id: sellerID })
    .then((foundSeller) => {
      if (foundSeller) {
        foundSeller.isOnline = !foundSeller.isOnline;
        foundSeller
          .save()
          .then((sellerSaved) => {
            if (sellerSaved.isOnline === true) {
              return res
                .json({
                  msg: "Online",
                  foundSeller: foundSeller,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({
                  msg: "Ofline",
                  foundSeller: foundSeller,
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
        return res.json({ msg: "No Seller", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

///////////Sign up with Image of seller/////////////
Router.post(
  "/update-seller-with-image",
  upload.fields([{ name: "sellerImages", maxCount: 1 }]),
  (req, res) => {
    let { data } = req.body;

    // const IdCardImage = CreateURL(req.files["IdCardImages"][0].filename);
    // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
    let seller = JSON.parse(data);

    //VALIDATIONS STARTS HERE
    let message = false;
    if (seller.sellerName.length < 3 && seller.sellerName === "") {
      message = "invalid seller name";
    }
    // else if (seller.password === "" && seller.password.length < 6) {
    //   message = "invalid password";
    // }
    else if (seller.address === "" && seller.address.length < 3) {
      message = "invalid address";
    } else if (seller.dateOfBirth === "") {
      message = "invalid dateOfBirth";
    } else if (seller.webSite === "") {
      message = "invalid webSite";
    } else if (seller.description === "") {
      message = "invalid description";
    } else if (seller.gender === "") {
      message = "invalid gender";
    }
    // else if (!RegularExpression.test(String(seller.email).toLowerCase())) {
    //   message = "invalid email";
    // }
    else {
      message = false;
    }
    if (message === false) {
      Seller.findOne({ _id: seller._id })
        .then((foundSeller) => {
          if (foundSeller !== null) {
            foundSeller.sellerName = seller.sellerName;
            foundSeller.email = foundSeller.email; //same
            foundSeller.phoneNumber = foundSeller.phoneNumber; //same
            foundSeller.dateOfBirth = seller.dateOfBirth;
            foundSeller.address = seller.address;
            foundSeller.webSite = seller.webSite;
            foundSeller.description = seller.description;
            foundSeller.gender = seller.gender;
            foundSeller.password = foundSeller.password; //same

            foundSeller.profileImgURL = foundSeller.profileImgURL; //same or changeable

            if (req.files["sellerImages"]) {
              const sellerProfileImage = CreateURL(
                req.files["sellerImages"][0].filename
              );
              foundSeller.profileImgURL = sellerProfileImage;
              console.log("Image Changed");
            }
            foundSeller.idCardImgURL = foundSeller.idCardImgURL; //same
            foundSeller
              .save()
              .then((sSeller) => {
                if (sSeller) {
                  sSeller.password = "";
                  return res
                    .json({
                      msg: "Seller Updated!",
                      newSeller: sSeller,
                      success: true,
                    })
                    .status(200);
                } else {
                  return res
                    .json({ msg: "Seller Not Updated!", success: false })
                    .status(400);
                }
              })
              .catch((err) => {
                console.log(err);
                console.log("error found");
                return res
                  .json({ msg: "seller catch error", success: false })
                  .status(400);
              });
          } else {
            return res
              .json({ msg: "Seller Not Found", success: false })
              .status(400);
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
Router.post("/verify-code-of-email", (req, res) => {
  let { email, code } = req.body;
  EmailVerification.findOne({ email: email })
    .then((found) => {
      if (found !== null) {
        console.log(found.code);
        if (found.code === code) {
          found.code = null;
          found.email = null;
          found
            .save()
            .then((UpdateVerified) => {
              if (UpdateVerified) {
                return res
                  .json({ msg: "Code Matched & Updated!", success: true })
                  .status(200);
              } else {
                return res
                  .json({ msg: "Code Not Update!", success: false })
                  .status(400);
              }
            })
            .catch((err) => {
              console.log(err);
              return res.json({ msg: "Failed!", success: false }).status(500);
            });
        } else {
          return res
            .json({ msg: "Code Not Matched!", success: false })
            .status(400);
        }
      } else {
        return res
          .json({ msg: "Seller Not Found!", success: false })
          .status(400);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Find Failed!", success: false }).status(500);
    });
});

////////////////////Password Reset By Email////////step 1///////////////////////
Router.post("/send-random-code-on-email", (req, res) => {
  let { email } = req.body;
  const RandomNumber = randomize("0", 6);
  EmailVerification.findOne({ email: email })
    .then((alreadyFound) => {
      if (alreadyFound !== null) {
        const mailOptions = {
          from: "mhanzlanaveed@gmail.com", // sender address
          to: email, // list of receivers
          subject: "Ace In A Hole app Email Verification Code ✔", // Subject line
          html: `<p>Email Verification Code: </p> ${Saved.code} `, // plain text body
        };
        // Email Sending Second Step
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log(err);
            return res
              .json({ msg: "Email Failed!", success: false })
              .status(400);
          } else {
            console.log("Email Sent!!!!!");
            return res
              .json({
                msg: `Email Sent to ${Saved.email}`,
                Saved,
                success: true,
              })
              .status(200);
          }
        }); // NODEMAILER END HERE
      } else {
        let newEmailVerification = new EmailVerification({
          email: email,
          code: RandomNumber,
        });

        newEmailVerification
          .save()
          .then((Saved) => {
            if (Saved) {
              const mailOptions = {
                from: "mhanzlanaveed@gmail.com", // sender address
                to: email, // list of receivers
                subject: "Ace In A Hole app Email Verification Code ✔", // Subject line
                html: `<p>Email Verification Code: </p> ${Saved.code} `, // plain text body
              };
              // Email Sending Second Step
              transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                  console.log(err);
                  return res
                    .json({ msg: "Email Failed!", success: false })
                    .status(400);
                } else {
                  console.log("Email Sent!!!!!");
                  return res
                    .json({
                      msg: `Email Sent to ${Saved.email}`,
                      Saved,
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
      }
    })
    .catch((err) => {
      return res
        .json({ msg: "Code Not Saved In DATABASE", success: false })
        .status(400);
    });
});

//////////////////// Emailed Code Matched,Check and Change///////////////////////////////
Router.post("/add-new-password", (req, res) => {
  let { seller } = req.body;
  if (seller.email === "") {
    message = "Invalid Email";
  } else if (seller.password === "") {
    message = "Invalid Password";
  } else {
    message = false;
  }
  if (message === false) {
    Seller.findOne({ email: seller.email })
      .then((sellerFound) => {
        if (sellerFound) {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              return res
                .json({
                  msg: "Salt Creation Failed!",
                  success: false,
                })
                .status(400);
            }
            bcrypt.hash(seller.password, salt, (err, hash) => {
              if (err) {
                return res
                  .json({ msg: "Hash Cration Failed!!!", success: false })
                  .status(400);
              }
              sellerFound.password = hash;
              sellerFound
                .save()
                .then((savedseller) => {
                  return res
                    .json({
                      msg: "seller Found & Password Updated",
                      sellerName: savedseller.sellerName,
                      success: true,
                    })
                    .status(200);
                })
                .catch((err) => {
                  console.log(err);
                  return res
                    .json({
                      msg: "seller Invalid!!!",
                      success: false,
                    })
                    .status(500);
                });
            });
          });
        } else {
          return res
            .json({ msg: "seller Not Found", success: false })
            .status(400);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "Failed!", success: false }).status(505);
      });
  }
});

//////////////////// Emailed Code Matched,Check and Change///////////////////////////////
Router.post("/forget-pass-code-match", (req, res) => {
  let { seller } = req.body;
  let message = false;
  if (seller.email === "") {
    message = "Invalid seller;s Email";
  } else if (seller.randomcode === "") {
    message = "Invalid Code";
  } else {
    message = false;
  }
  if (message === false) {
    // const RandomNumber = randomize("0", 6);

    Seller.findOne({
      email: seller.email,
      RandomNumber: seller.randomcode,
    }).then((foundseller) => {
      if (foundseller !== null) {
        foundseller.RandomNumber = null; //Change the code from dataBase
        foundseller.save().then((Updateseller) => {
          console.log("***Updateseller.RandomNumber***");
          console.log(Updateseller.RandomNumber);
          return res
            .json({
              msg: "seller And Code Verified",
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
    });
  }
});

////////////////////Password Reset By Email////////step 1///////////////////////
Router.post("/forget-pass-send-email", (req, res) => {
  let { email } = req.body;
  const RandomNumber = randomize("0", 6);
  Seller.findOne({ email: email })
    .then((foundSeller) => {
      if (foundSeller !== null) {
        foundSeller.RandomNumber = RandomNumber;
        foundSeller
          .save()
          .then((SavedRandomNumber) => {
            // return res.json(SavedRandomNumber);
            if (SavedRandomNumber) {
              const mailOptions = {
                from: "mhanzlanaveed@gmail.com", // sender address
                to: email, // list of receivers
                subject: "Ace In A Hole app Reset Code ✔", // Subject line
                html: `<p>Password Reset Code: </p> ${foundSeller.RandomNumber} `, // plain text body
              };
              // Email Sending Second Step
              transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                  console.log(err);
                  return res
                    .json({ msg: "Email Failed!", success: false })
                    .status(400);
                } else {
                  console.log("Email Sent!!!!!");
                  return res
                    .json({
                      msg: `Email Sent to ${foundSeller.sellerName}`,

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
            msg: "Seller Not Exist !!! ",
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

Router.post("/all-sellers-details", (req, res) => {
  Seller.find()
    .then((foundSeller) => {
      if (foundSeller.length > 0) {
        foundSeller.password = "";
        return res
          .json({
            msg: "All Sellers Details!",
            foundSellers: foundSeller,
            success: true,
          })
          .status(200);
      } else {
        return res.json({ msg: "No Seller", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/single-seller-details", (req, res) => {
  let { sellerID } = req.body;
  Seller.findOne({ _id: sellerID })
    .then((foundSeller) => {
      if (foundSeller) {
        return res
          .json({
            msg: "Seller Details!",
            foundSeller: foundSeller,
            success: true,
          })
          .status(200);
      } else {
        return res.json({ msg: "No Seller", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

//SELLER LOG IN API
Router.post("/seller-login", (req, res) => {
  let { seller } = req.body;

  /////Validations Starts Here
  let RegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let message = false;
  if (seller.password === "" && seller.password.length < 6) {
    message = "invalid password";
  } else if (!RegularExpression.test(String(seller.email).toLowerCase())) {
    message = "invalid email";
  } else {
    message = false;
  }
  if (message === false) {
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
  /////////////Email Already  Exist Or not Check////////////////
  Seller.findOne({ email: seller.email })
    .then((fndseller) => {
      if (fndseller) {
        ///////////// Password Compare /////////
        bcrypt
          .compare(seller.password, fndseller.password)
          .then((findseller) => {
            if (findseller) {
              fndseller.password = "";
              return res
                .json({
                  msg: "Authenticated Seller",
                  result: fndseller,
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
              .json({ msg: "catch error password comparison", success: false })
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
}); //LOGIN API ENDS

///////////Sign up with Image of seller/////////////
Router.post(
  "/register-seller-with-image",
  upload.fields([
    { name: "sellerImages", maxCount: 1 },
    { name: "IdCardImages", maxCount: 8 },
  ]),
  (req, res) => {
    // return res.json(1);
    let { data } = req.body;
    const sellerProfileImage = CreateURL(req.files["sellerImages"][0].filename);
    const IdCardImage = CreateURL(req.files["IdCardImages"][0].filename);
    // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
    let seller = JSON.parse(data);

    //VALIDATIONS STARTS HERE
    let RegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let message = false;
    if (seller.sellerName.length < 3 && seller.sellerName === "") {
      message = "invalid seller name";
    } else if (seller.phoneNumber === "" && seller.phoneNumber.length < 6) {
      message = "invalid phoneNumber";
    } else if (seller.password === "" && seller.password.length < 6) {
      message = "invalid password";
    } else if (seller.address === "" && seller.address.length < 3) {
      message = "invalid address";
    } else if (seller.dateOfBirth === "") {
      message = "invalid dateOfBirth";
    } else if (seller.webSite === "") {
      message = "invalid webSite";
    } else if (seller.description === "") {
      message = "invalid description";
    } else if (seller.gender === "") {
      message = "invalid gender";
    } else if (!RegularExpression.test(String(seller.email).toLowerCase())) {
      message = "invalid email";
    } else {
      message = false;
    }
    if (message === false) {
      Seller.findOne({ email: seller.email })
        .then((fEmail) => {
          if (fEmail !== null) {
            return res
              .json({ msg: "Email Already exist", success: false })
              .status(400);
          } else {
            bcrypt.genSalt(10, (err, salt) => {
              // Generate Salt Here
              if (err) {
                return res
                  .json({ msg: "salt creation failed!", success: false })
                  .status(400);
              }
              bcrypt.hash(seller.password, salt, (err, hash) => {
                // Generate Hash Here
                if (err) {
                  return res
                    .json({ msg: "hash creation failed!", success: false })
                    .status(400);
                }
                let newSeller = new Seller({
                  sellerName: seller.sellerName,
                  email: seller.email,
                  phoneNumber: seller.phoneNumber,
                  dateOfBirth: seller.dateOfBirth,
                  address: seller.address,
                  webSite: seller.webSite,
                  description: seller.description,
                  gender: seller.gender,
                  password: hash,
                  profileImgURL: sellerProfileImage,
                  idCardImgURL: IdCardImage,
                });
                newSeller
                  .save()
                  .then((sSeller) => {
                    if (sSeller) {
                      sSeller.password = "";
                      return res
                        .json({
                          msg: "Seller Registered!",
                          newSeller: sSeller,
                          success: true,
                        })
                        .status(200);
                    } else {
                      return res
                        .json({ msg: "Seller Not Save!", success: false })
                        .status(400);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    console.log("error found");
                    return res
                      .json({ msg: "seller catch error", success: false })
                      .status(400);
                  });
              });
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
module.exports = Router;
