const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const { Service, ServiceCategory } = require("../../MODELS");
const { upload, CreateURL } = require("../../storage")();

Router.post("/delete-any-certificate-in-existing-service", (req, res) => {
  let { _id, removedCertificatedURLs } = req.body;

  Service({ _id: _id }).then((foundService) => {
    if (foundService) {
      if (foundService.certificatesImgsURLs.length > 0) {
        for (let x = 0; x < foundService.certificatesImgsURLs.length; x++) {
          if (
            foundService.certificatesImgsURLs[x] === removedCertificatedURLs
          ) {
          }
        }
      } else {
        return res.json({ msg: "No Certificate", success: false }).status(400);
      }
    } else {
      return res.json({ msg: "No Service", success: false }).status(500);
    }
  });
});

Router.post(
  "/update-service-of-seller-with-image",
  upload.fields([
    { name: "certificatesImgs", maxCount: 4 },
    { name: "serviceImgs", maxCount: 3 },
  ]),
  (req, res) => {
    let { data } = req.body;
    let serviceImgArray = [];
    // const serviceImgs = CreateURL(req.files["serviceImgss"][0].filename);
    // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
    let service = JSON.parse(data);

    //VALIDATIONS STARTS HERE
    let message = false;
    if (service.serviceName === "") {
      message = "invalid service name";
    } else if (service._id === "") {
      message = "invalid _id";
    }
    //  else if (service.category === "") {
    //   message = "invalid category";
    // }
    else if (service.price === "") {
      message = "invalid price";
    } else if (service.description === "") {
      message = "invalid description";
    } else if (service.serviceDaysArray === "") {
      message = "invalid serviceDaysArray";
    } else if (service.toTime === "") {
      message = "invalid toTime";
    } else if (service.fromTime === "") {
      message = "invalid fromTime";
    } else {
      message = false;
    }
    if (message === false) {
      Service.findOne({ _id: service._id })
        .then((foundService) => {
          if (foundService !== null) {
            foundService.serviceName = service.serviceName;
            foundService.seller = foundService.seller;
            foundService.category = foundService.category;
            foundService.price = service.price;
            foundService.description = service.description;
            foundService.serviceDaysArray = service.serviceDaysArray;
            foundService.toTime = service.toTime;
            foundService.fromTime = service.fromTime;
            foundService.serviceImgsURLs = foundService.serviceImgsURLs;
            if (req.files["serviceImgs"]) {
              for (let x = 0; x < req.files["serviceImgs"].length; x++) {
                serviceImgArray.push(
                  CreateURL(req.files["serviceImgs"][x].filename)
                );
              }
              foundService.serviceImgsURLs = serviceImgArray;
            }
            foundService.certificatesImgsURLs =
              foundService.certificatesImgsURLs;

            foundService
              .save()
              .then((sService) => {
                if (sService) {
                  return res
                    .json({
                      msg: "Service Updated!",
                      newService: sService,
                      success: true,
                    })
                    .status(200);
                } else {
                  return res
                    .json({ msg: "Service Not Updated!", success: false })
                    .status(400);
                }
              })
              .catch((err) => {
                console.log(err);
                console.log("error found");
                return res
                  .json({ msg: "Service catch error", success: false })
                  .status(400);
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

Router.post("/delete-service", (req, res) => {
  let { _id } = req.body;
  Service.remove({ _id: _id })
    .then((foundService) => {
      if (foundService.n === 1) {
        return res
          .json({
            msg: "Service  Deleted!",
            removedService: _id,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "Invalid!",
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

Router.post("/show-all-services", (req, res) => {
  Service.find()
    .then((foundServices) => {
      if (foundServices.length > 0) {
        return res
          .json({
            msg: "All Services!",
            foundServices: foundServices,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "No Service Found!",
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

Router.post("/show-all-services-of-specific-seller", (req, res) => {
  let { sellerID } = req.body;
  Service.find({ seller: sellerID })
    .then((foundService) => {
      if (foundService.length > 0) {
        return res
          .json({
            msg: "all-services-of-specific-seller",
            foundService: foundService,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "No Service Found!",
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

Router.post("/show-single-service", (req, res) => {
  let { _id } = req.body;
  Service.findOne({ _id: _id })
    .then((foundService) => {
      if (foundService) {
        return res
          .json({
            msg: "Service Found!",
            foundService: foundService,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "No Service Found!",
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

///////////Sign up with Image of seller/////////////
Router.post(
  "/add-new-certificate-in-existing-service",
  upload.fields([{ name: "certificatesImgs", maxCount: 4 }]),
  (req, res) => {
    let { data } = req.body;
    let certificateImgArray = [];
    for (let y = 0; y < req.files["certificatesImgs"].length; y++) {
      certificateImgArray.push(
        CreateURL(req.files["certificatesImgs"][y].filename)
      );
    }
    // GET DATE AS STRING AND PARSE THAT DATA INTO JSON
    let service = JSON.parse(data);
    //VALIDATIONS STARTS HERE
    let message = false;
    if (service._id === "") {
      message = "invalid _id";
    } else {
      message = false;
    }
    if (message === false) {
      Service.findOne({ _id: service._id })
        .then((foundService) => {
          // return res.json(foundService);
          // foundService.certificatesImgsURLs.push({ certificateImgArray });
          foundService.certificatesImgsURLs =
            foundService.certificatesImgsURLs + certificateImgArray;

          foundService
            .save()
            .then((savedCertificate) => {
              if (savedCertificate) {
                return res
                  .json({
                    msg: "Certificate added!",
                    newCertificate: savedCertificate,
                    success: true,
                  })
                  .status(200);
              } else {
                return res
                  .json({ msg: "Service Not Save!", success: false })
                  .status(400);
              }
            })
            .catch((err) => {
              console.log(err);
              console.log("error found");
              return res
                .json({ msg: "Service catch error", success: false })
                .status(400);
            });
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

///////////Sign up with Image of seller/////////////
Router.post(
  "/test-api",
  upload.fields([
    // { name: "certificatesImgs", maxCount: 4 },
    { name: "serviceImgs", maxCount: 3 },
  ]),
  (req, res) => {
    let serviceImgArray = [];
    for (let x = 0; x < req.files["serviceImgs"].length; x++) {
      console.log(req.files["serviceImgs"][x].filename);
      serviceImgArray.push(CreateURL(req.files["serviceImgs"][x].filename));
    }
    // let { data } = req.body;
    // let service = JSON.parse(req.files["serviceImgs"].length);
    console.log(serviceImgArray);
    let abc = req.files["serviceImgs"].length;
    return res.json({ length: abc });
  }
);

///////////Sign up with Image of seller/////////////
Router.post(
  "/add-new-service-of-seller-with-image",
  upload.fields([
    { name: "certificatesImgs", maxCount: 4 },
    { name: "serviceImgs", maxCount: 3 },
  ]),
  (req, res) => {
    // return res.json(req.files["serviceImgs"]);
    let { data } = req.body;
    let serviceImgArray = [];
    let certificateImgArray = [];
    for (let x = 0; x < req.files["serviceImgs"].length; x++) {
      serviceImgArray.push(CreateURL(req.files["serviceImgs"][x].filename));
    }

    for (let y = 0; y < req.files["certificatesImgs"].length; y++) {
      certificateImgArray.push(
        CreateURL(req.files["certificatesImgs"][y].filename)
      );
    }

    // const certificatesImgs = CreateURL(
    //   req.files["certificatesImgs"][0].filename
    // );
    // const serviceImgs = CreateURL(req.files["serviceImgss"][0].filename);
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
    } else if (service.serviceDaysArray === "") {
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
        .then((fEmail) => {
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
              serviceImgsURLs: serviceImgArray,
              certificatesImgsURLs: certificateImgArray,
            });
            newService
              .save()
              .then((sService) => {
                if (sService) {
                  return res
                    .json({
                      msg: "Service Created!",
                      newService: sService,
                      success: true,
                    })
                    .status(200);
                } else {
                  return res
                    .json({ msg: "Service Not Save!", success: false })
                    .status(400);
                }
              })
              .catch((err) => {
                console.log(err);
                console.log("error found");
                return res
                  .json({ msg: "Service catch error", success: false })
                  .status(400);
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

Router.post("/delete-service-category", (req, res) => {
  let { _id } = req.body;
  ServiceCategory.remove({ _id: _id })
    .then((foundCategories) => {
      if (foundCategories.n === 1) {
        return res
          .json({
            msg: "Service Category Deleted!",
            removedCategory: _id,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "Invalid!",
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

Router.post("/show-all-service-categories", (req, res) => {
  ServiceCategory.find()
    .then((foundCategories) => {
      if (foundCategories.length > 0) {
        return res
          .json({
            msg: "Service Category Found!",
            foundCategories: foundCategories,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "No Category Found!",
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

Router.post("/show-single-service-category", (req, res) => {
  let { _id } = req.body;
  ServiceCategory.findOne({ _id: _id })
    .then((foundCategory) => {
      if (foundCategory) {
        return res
          .json({
            msg: "Service Category Found!",
            foundCategory: foundCategory,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({
            msg: "No Category Found!",
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

Router.post(
  "/add-new-service-category",
  upload.fields([{ name: "serviceCategoryIMG", maxCount: 4 }]),
  (req, res) => {
    let { data } = req.body;
    let service = JSON.parse(data);

    if (!req.files["serviceCategoryIMG"]) {
      return res.json({ msg: "Img is Compulsory", success: false }).status(404);
    }
    if (service.serviceCategoryName === "") {
      return res
        .json({ msg: "Invalid serviceCategoryName", success: false })
        .status(404);
    }

    const serviceCategoryIMG = CreateURL(
      req.files["serviceCategoryIMG"][0].filename
    );

    let newserviceCategoryName = new ServiceCategory({
      serviceCategoryName: service.serviceCategoryName,
      categoryImgURL: serviceCategoryIMG,
    });
    newserviceCategoryName
      .save()
      .then((savedCategory) => {
        if (savedCategory) {
          return res
            .json({
              msg: "New Service Category Added",
              savedCategory: savedCategory,
              success: true,
            })
            .status(200);
        } else {
          return res.json({ msg: "Not Added", success: false }).status(400);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "Failed!", success: false }).status(505);
      });
  }
);

module.exports = Router;
