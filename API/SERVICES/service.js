const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const { EmailVerification, Service, ServiceCategory } = require("../../MODELS");
const { upload, CreateURL } = require("../../storage")();

///////////Sign up with Image of seller/////////////
Router.post(
  "/add-new-service-of-seller-with-image",
  upload.fields([
    { name: "certificatesImgs", maxCount: 4 },
    { name: "serviceImgs", maxCount: 3 }
  ]),
  (req, res) => {
    let { data } = req.body;
    const certificatesImgs = CreateURL(
      req.files["certificatesImgs"][0].filename
    );
    const serviceImgs = CreateURL(req.files["serviceImgss"][0].filename);
    // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
    let service = JSON.parse(data);

    //VALIDATIONS STARTS HERE
    let message = false;
    if (service.serviceName === "") {
      message = "invalid service name";
    } else if (service.seller === "") {
      message = "invalid seller";
    } else if (service.category === "") {
      message = "invalid category";
    } else if (service.price === "") {
      message = "invalid price";
    } else if (service.description === "") {
      message = "invalid description";
    } else if (service.serviceDaysArray.length > 0) {
      message = "invalid serviceDaysArray";
    } else if (service.toTime === "") {
      message = "invalid toTime";
    } else if (service.fromTime === "") {
      message = "invalid fromTime";
    } else {
      message = false;
    }
    if (message === false) {
      Service.findOne({ serviceName: service.serviceName })
        .then(fEmail => {
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
              toTime: service.toTime,
              fromTime: service.fromTime,
              serviceImgsURLs: serviceImgs,
              certificatesImgsURLs: certificatesImgs
            });
            newService
              .save()
              .then(sService => {
                if (sService) {
                  sService.password = "";
                  return res
                    .json({
                      msg: "Service Created!",
                      newService: sService,
                      success: true
                    })
                    .status(200);
                } else {
                  return res
                    .json({ msg: "Service Not Save!", success: false })
                    .status(400);
                }
              })
              .catch(err => {
                console.log(err);
                console.log("error found");
                return res
                  .json({ msg: "Service catch error", success: false })
                  .status(400);
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
  }
);

Router.post("/delete-service-category", (req, res) => {
  let { _id } = req.body;
  ServiceCategory.remove({ _id: _id })
    .then(foundCategories => {
      if (foundCategories.n === 1) {
        return res
          .json({
            msg: "Service Category Deleted!",
            removedCategory: _id,
            success: true
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "Invalid!",
            success: false
          })
          .status(400);
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/show-all-service-categories", (req, res) => {
  ServiceCategory.find()
    .then(foundCategories => {
      if (foundCategories.length > 0) {
        return res
          .json({
            msg: "Service Category Found!",
            foundCategories: foundCategories,
            success: true
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "No Category Found!",
            success: false
          })
          .status(400);
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/show-single-service-category", (req, res) => {
  let { _id } = req.body;
  ServiceCategory.findOne({ _id: _id })
    .then(foundCategory => {
      if (foundCategory) {
        return res
          .json({
            msg: "Service Category Found!",
            foundCategory: foundCategory,
            success: true
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "No Category Found!",
            success: false
          })
          .status(400);
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/add-new-service-category", (req, res) => {
  let { serviceCategoryName } = req.body;
  let newserviceCategoryName = new ServiceCategory({
    serviceCategoryName: serviceCategoryName
  });
  newserviceCategoryName
    .save()
    .then(savedCategory => {
      if (savedCategory) {
        return res
          .json({
            msg: "New Service Category Added",
            savedCategory: savedCategory,
            success: true
          })
          .status(200);
      } else {
        return res.json({ msg: "Not Added", success: false }).status(400);
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

module.exports = Router;
