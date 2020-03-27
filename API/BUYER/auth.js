const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const { Seller, Warehouse, SellerBank } = require("../../MODALS");
const randomize = require("randomatic");
const transporter = require("../emailSend");
const { upload, CreateURL } = require("../../storage")();
const { linearSearch } = require("../../MyMODULES/searchModules");

////////////////test/////////////////
Router.post("/test", (req, res) => {
  let arrayTest = [2, 4, 6, 7, 9, 0, 2, 3];
  let valueTest = 7;

  const a = linearSearch(arrayTest, valueTest);
  console.log(a);
});

///////////Sign up with Image of seller/////////////
Router.post("/signup-seller", upload.array("chequeImages", 2), (req, res) => {
  let imageArrays = req.files;
  let { data } = req.body;
  // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
  let JSONdata = JSON.parse(data);

  // IMAGE URLS WILL BE CREATE BELOW
  let ImageURLsArray = [];
  imageArrays.forEach(eachFoundPic => {
    ImageURLsArray.push(`/files/vendor-files/image/${eachFoundPic.filename}`);
  });
  // VALIDATION STARTS HERE
  let RegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let message = "";
  //////// Check for Name should not less than 3
  if (seller.sellerName.length < 3) {
    message = "invalid first name";
    //////Check name should not empty
  } else if (seller.phoneNumber === "") {
    message = "invalid phone number";
  } else if (!RegularExpression.test(String(seller.email).toLowerCase())) {
    message = "invalid email";
  } else {
    message = false;
  }
  if (message === false) {
    Seller.findOne({ email: seller.email })
      .then(fEmail => {
        if (fEmail) {
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
                shopName: seller.shopName,
                phoneNumber: seller.phoneNumber,
                email: seller.email,
                password: hash
              });
              newSeller
                .save() // Save Seller Here
                .then(sSeller => {
                  // Validate &  Save Warehouse
                  if (sSeller) {
                    let savedseller = {
                      _id: sSeller._id,
                      sellerName: sSeller.sellerName,
                      shopName: sSeller.shopName,
                      phoneNumber: sSeller.phoneNumber,
                      email: sSeller.email
                    };
                    let newWareHouse = new Warehouse({
                      seller: sSeller._id,
                      country: warehouse.country,
                      state: warehouse.state,
                      city: warehouse.city,
                      address: warehouse.address,
                      area: warehouse.area,
                      location: warehouse.location
                    });
                    if (warehouse.isBusinessAddressSame === true) {
                      newWareHouse.businessAddress = warehouse.address;
                    } else {
                      newWareHouse.businessAddress = warehouse.businessAddress;
                    }
                    if (warehouse.isReturnAddressSame === true) {
                      newWareHouse.returnAddress = warehouse.address;
                    } else {
                      newWareHouse.returnAddress = warehouse.returnAddress;
                    }

                    newWareHouse
                      .save()
                      .then(snewWareHouse => {
                        if (snewWareHouse) {
                          let newSellerBank = new SellerBank({
                            seller: sSeller._id,
                            accountTitle: sellerbank.accountTitle,
                            bankName: sellerbank.bankName,
                            accountNumber: sellerbank.accountNumber,
                            branchCode: sellerbank.branchCode,
                            chequeImgURL: ImageURLsArray
                          });
                          newSellerBank
                            .save()
                            .then(snewSellerBank => {
                              if (snewSellerBank) {
                                return res
                                  .json({
                                    msg: "SignUp successfully",
                                    savedSeller: savedseller,
                                    savedWarehouse: snewWareHouse,
                                    savedBank: snewSellerBank,
                                    success: true
                                  })
                                  .status(200);
                              }
                            })
                            .catch(err => {
                              console.log(err);
                              console.log("error found");
                              return res
                                .json({
                                  msg: "Bank catch error!",
                                  success: false
                                })
                                .status(400);
                            });
                        }
                      })
                      .catch(err => {
                        console.log(err);
                        console.log("error found");
                        return res
                          .json({
                            msg: "ware house catch error",
                            success: false
                          })
                          .status(400);
                      });
                  } else {
                    return res
                      .json({ msg: "Failed!", success: false })
                      .status(400);
                  }
                })
                .catch(err => {
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
      .catch(err => {
        console.log(err);
        return res
          .json({ msg: "Catch Error Email", success: false })
          .status(400);
      });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
});
module.exports = Router;
