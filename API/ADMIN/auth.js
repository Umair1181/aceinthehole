const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const { Admin } = require("../../MODELS");

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
