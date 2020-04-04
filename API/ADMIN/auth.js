const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const { Admin } = require("../../MODELS");
const randomize = require("randomatic");
const transporter = require("../emailSend");

// //////////////////// add-new-password///////////////////////////////
Router.post("/add-new-password", (req, res) => {
  let { admin } = req.body;
  if (admin.email === "") {
    message = "Invalid Email";
  } else if (admin.password === "") {
    message = "Invalid Password";
  } else {
    message = false;
  }
  if (message === false) {
    Admin.findOne({ email: admin.email })
      .then(adminFound => {
        if (adminFound) {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              return res
                .json({
                  msg: "Salt Creation Failed!",
                  success: false
                })
                .status(400);
            }
            bcrypt.hash(admin.password, salt, (err, hash) => {
              if (err) {
                return res
                  .json({ msg: "Hash Cration Failed!!!", success: false })
                  .status(400);
              }
              adminFound.password = hash;
              adminFound
                .save()
                .then(savedadmin => {
                  savedadmin.password = null;
                  return res
                    .json({
                      msg: "admin Found & Password Updated",
                      adminName: savedadmin,
                      success: true
                    })
                    .status(200);
                })
                .catch(err => {
                  console.log(err);
                  return res
                    .json({
                      msg: "admin Invalid!!!",
                      adminPassword: savedadmin.password,
                      success: false
                    })
                    .status(500);
                });
            });
          });
        } else {
          return res
            .json({ msg: "admin Not Found", success: false })
            .status(400);
        }
      })
      .catch(err => {
        console.log(err);
        return res.json({ msg: "Failed!", success: false }).status(500);
      });
  }
});

// //////////////////// Emailed Code Matched,Check and Change///////////////////////////////
Router.post("/forget-pass-code-match", (req, res) => {
  let { admin } = req.body;
  let message = false;
  if (admin.email === "") {
    message = "Invalid admin's Email";
  } else if (admin.randomcode === "") {
    message = "Invalid Code";
  } else {
    message = false;
  }
  if (message === false) {
    // const RandomNumber = randomize("0", 6);

    Admin.findOne({
      email: admin.email,
      RandomNumber: admin.randomcode
    })
      .then(foundadmin => {
        if (foundadmin !== null) {
          foundadmin.RandomNumber = null; //Change the code from dataBase
          foundadmin.save().then(Updateadmin => {
            console.log(Updateadmin.RandomNumber);
            return res
              .json({
                msg: "admin And Code Verified",
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
  Admin.findOne({ email: email })
    .then(found => {
      if (found !== null) {
        found.RandomNumber = RandomNumber;
        found
          .save()
          .then(SavedRandomNumber => {
            if (SavedRandomNumber) {
              const mailOptions = {
                from: "mhanzlanaveed@gmail.com", // sender address
                to: email, // list of receivers
                subject: "Ace In A Hole App Reset Code ✔", // Subject line
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
                      msg: `Email Sent`,

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
            msg: "Invalid !!! ",
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

/////////////////admin LOG IN API///////////////////////////
Router.post("/admin-login", (req, res) => {
  let { admin } = req.body;

  /////Validations Starts Here
  let message = false;
  let RegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (admin.email.length < 3 && admin.email === "") {
    message = "invalid email !!";
  } else if (!RegularExpression.test(String(admin.email).toLowerCase())) {
    message = "invalid email";
  } else if (admin.password === "" && admin.password.length < 4) {
    message = "invalid password";
  } else {
    message = false;
  }
  if (message === false) {
    /////////////Email Already  Exist Or not Check////////////////
    Admin.findOne({ email: admin.email })
      .then(foundAdmin => {
        if (foundAdmin) {
          ///////////// Password Compare /////////
          bcrypt
            .compare(admin.password, foundAdmin.password)
            .then(findbuyer => {
              if (findbuyer) {
                let foundadmin = {
                  _id: foundAdmin._id,
                  email: foundAdmin.email
                };
                return res
                  .json({
                    msg: "Authenticated Admin",
                    foundadmin,
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
          return res
            .json({ msg: "Admin Not Found", success: false })
            .status(400);
        }
      })
      .catch(err => {
        console.log(err);
        return res.json({ msg: "catch error ", success: false }).status(500);
      });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
}); //LOGIN API ENDS

////////////////////////Sign up Admin//////////////////////////////
Router.post("/register-admin", (req, res) => {
  let { admin } = req.body;
  let RegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let message = false;
  if (admin.email.length < 3 && admin.email === "") {
    message = "invalid email";
  } else if (admin.password === "" && admin.password.length < 4) {
    message = "invalid password";
  } else if (!RegularExpression.test(String(admin.email).toLowerCase())) {
    message = "invalid email";
  } else {
    message = false;
  }
  if (message === false) {
    Admin.findOne({ email: admin.email })
      .then(foundEmail => {
        if (foundEmail !== null) {
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
            bcrypt.hash(admin.password, salt, (err, hash) => {
              // Generate Hash Here
              if (err) {
                return res
                  .json({ msg: "hash creation failed!", success: false })
                  .status(400);
              }
              let newAdmin = new Admin({
                email: admin.email,
                password: hash
              });
              newAdmin
                .save()
                .then(saveAdmin => {
                  if (saveAdmin) {
                    let savedAdmin = {
                      _id: saveAdmin._id,
                      email: saveAdmin.email
                    };
                    return res
                      .json({
                        msg: "Admin is Saved!",
                        savedAdmin: savedAdmin,
                        success: true
                      })
                      .status(200);
                  } else {
                    return res
                      .json({ msg: "Admin Not Save!", success: false })
                      .status(400);
                  }
                })
                .catch(err => {
                  console.log(err);
                  console.log("error found");
                  return res
                    .json({ msg: "catch error", success: false })
                    .status(400);
                });
            });
          });
        }
      })
      .catch(err => {
        console.log(err);
        return res.json({ msg: "Catch Error", success: false }).status(400);
      });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
});
module.exports = Router;
