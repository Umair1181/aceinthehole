const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const { Service, ServiceCategory, Reviews } = require("../../MODELS");
const { upload, CreateURL } = require("../../storage")();
// const deleteImg = require("../FIES/imageAPI");
const ServiceClass = require("../BusinessLogics/service");

Router.post("/show-all-services", (req, res) => {
  let { userID } = req.body;
  Service.find()
    .populate({ path: "seller" })
    .populate({ path: "category" })
    .then((foundServices) => {
      new ServiceClass()
        .checkServiceInCart(foundServices, userID)
        .then((servicesWithStatus) => {
          if (servicesWithStatus.length > 0) {
            return res
              .json({
                msg: "All Services with status of in cart!",
                foundServices: servicesWithStatus,
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
        });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

///////////Sign up with Image of seller/////////////
Router.post(
  "/update-service-images",
  upload.array("IMGs", 5),
  async (req, res) => {
    // let Deleted = await deleteImg.deleteImgFile();
    // if (Deleted === "File Deleted") {
    //   return res.json({ del: Deleted });
    // }
    // return res.json(Deleted);

    let { data } = req.body;
    let ImgArray = [];
    let IMGs = req.files;
    IMGs.forEach((eachFoundPic) => {
      ImgArray.push(`/files/vendor-files/image/${eachFoundPic.filename}`);
    });
    let service = JSON.parse(data);
    let foundService = await Service.findOne({ _id: service._id });
    let saveService = "";
    if (service.isServiceOrCertificateImg === true) {
      //update or delete image of service
      if (ImgArray.length > 0) {
        //add image in servic
        for (let k = 0; k < ImgArray.length; k++) {
          foundService.serviceImgsURLs.push(ImgArray[k]);
        }
        saveService = await foundService.save();
        if (saveService) {
        }
      }

      ///remove URL from table and chunks from db files
      if (service.removeURL.length > 0) {
        await Service.update(
          { _id: service._id },
          { $pullAll: { serviceImgsURLs: service.removeURL } }
        );
      }

      let foundService1 = await Service.findOne({ _id: service._id });
      return res
        .json({
          msg: "Service Update",
          foundService: foundService1,
          success: true,
        })
        .status(200);
    } else {
      //update or delete image of certificate
      //update or delete image of service
      if (ImgArray.length > 0) {
        //add image in servic
        for (let k = 0; k < ImgArray.length; k++) {
          foundService.certificatesImgsURLs.push(ImgArray[k]);
        }
        saveService = await foundService.save();
        if (saveService) {
        }
      }

      ///remove URL from table and chunks from db files
      if (service.removeURL.length > 0) {
        await Service.update(
          { _id: service._id },
          { $pullAll: { certificatesImgsURLs: service.removeURL } }
        );
      }
      //pulllll
      let foundService1 = await Service.findOne({ _id: service._id });
      return res
        .json({
          msg: "Service Update",
          foundService: foundService1,
          success: true,
        })
        .status(200);
    }

    // return res.json({ service, IMGs });
  }
);

///////////Sign up with Image of seller/////////////
Router.post(
  "/add-new-service-of-seller-with-image",
  upload.array("serviceImgs", 5),

  (req, res) => {
    let { data } = req.body;
    let serviceImgArray = [];
    let serviceImgs = req.files;
    serviceImgs.forEach((eachFoundPic) => {
      serviceImgArray.push(
        `/files/vendor-files/image/${eachFoundPic.filename}`
      );
    });

    // for (let x = 0; x < req.files["serviceImgs"].length; x++) {
    //   serviceImgArray.push(CreateURL(req.files["serviceImgs"][x].filename));
    // }

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
    } else if (service.serviceDaysArray.day === "") {
      message = "invalid serviceDaysArray.day";
    } else if (service.serviceDaysArray.toTime === "") {
      message = "invalid toTime";
    } else if (service.serviceDaysArray.fromTime === "") {
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
              serviceImgsURLs: serviceImgArray,
              certificatesImgsURLs: service.certificatesImgs,
            });
            newService
              .save()
              .then(async (sService) => {
                let foundService = await Service.findOne({
                  _id: sService._id,
                }).populate({ path: "category" });
                if (sService) {
                  return res
                    .json({
                      msg: "Service Created!",
                      newService: foundService,
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
                  .json({
                    msg: "Service catch error  123",
                    err,
                    success: false,
                  })
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

Router.post("/upload", upload.array("image", 1), (req, res) => {
  let imageArrays = req.files;
  let ImageURLsArray = [];
  imageArrays.forEach((eachFoundPic) => {
    ImageURLsArray.push(`/files/vendor-files/image/${eachFoundPic.filename}`);
  });

  if (ImageURLsArray.length > 0) {
    return res
      .json({
        msg: "Imgae Uploaded!",
        imgurl: ImageURLsArray[0],
        success: true,
      })
      .status(400);
  } else {
    return res.json({ msg: "Failed!", success: false }).status(400);
  }
});

Router.post("/show-all-services-of-specific-category", (req, res) => {
  let { categoryID, userID } = req.body;
  Service.find({ category: categoryID })
    .then((foundService) => {
      new ServiceClass()
        .checkServiceInCart(foundService, userID)
        .then((servicesWithStatus) => {
          if (servicesWithStatus.length > 0) {
            return res
              .json({
                msg: "all-services-of-specific-category-with-cart-status",
                foundService: servicesWithStatus,
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
        });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post(
  "/update-service-category",
  upload.array("serviceCategoryIMG", 9),
  // upload.fields([{ name: "serviceCategoryIMG", maxCount: 1 }]),
  (req, res) => {
    let { data } = req.body;
    let service = JSON.parse(data);
    let imageArrays = req.files;
    let message = false;
    let ImageURLsArray = [];
    imageArrays.forEach((eachFoundPic) => {
      ImageURLsArray.push(`/files/vendor-files/image/${eachFoundPic.filename}`);
    });

    if (imageArrays.length >= 2) {
      message = "Add one Image only!";
    }
    if (message === false) {
      ServiceCategory.findOne({ _id: service._id })
        .then((foundCategories) => {
          if (foundCategories !== null) {
            foundCategories.serviceCategoryName =
              foundCategories.serviceCategoryName;
            foundCategories.categoryImgURL = foundCategories.categoryImgURL;
            if (ImageURLsArray.length > 0) {
              foundCategories.categoryImgURL = ImageURLsArray[0];
            }
            // if (req.files["serviceCategoryIMG"]) {
            //   foundCategories.categoryImgURL = serviceCategoryIMG;
            // }

            if (service.serviceCategoryName !== "") {
              foundCategories.serviceCategoryName = service.serviceCategoryName;
            }

            foundCategories
              .save()
              .then((saved) => {
                if (saved) {
                  return res
                    .json({ msg: "Updated", saved, success: false })
                    .status(404);
                } else {
                  return res
                    .json({ msg: "Not Updated", success: false })
                    .status(404);
                }
              })
              .catch((err) => {
                console.log(err);
                return res.json({ msg: "Failed!", success: false }).status(505);
              });
          } else {
            return res.json({ msg: "Not Found", success: false }).status(505);
          }
        })
        .catch((err) => {
          console.log(err);
          return res.json({ msg: "Failed!", success: false }).status(505);
        });
    } else {
      return res.json({ msg: message, success: false }).status(404);
    }

    // const serviceCategoryIMG = CreateURL(
    //   req.files["serviceCategoryIMG"][0].filename
    // );

    // let newserviceCategoryName = new ServiceCategory({
    //   serviceCategoryName: service.serviceCategoryName,
    //   categoryImgURL: serviceCategoryIMG,
    // });
    // newserviceCategoryName
    //   .save()
    //   .then((savedCategory) => {
    //     if (savedCategory) {
    //       return res
    //         .json({
    //           msg: "New Service Category Added",
    //           savedCategory: savedCategory,
    //           success: true,
    //         })
    //         .status(200);
    //     } else {
    //       return res.json({ msg: "Not Added", success: false }).status(400);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return res.json({ msg: "Failed!", success: false }).status(505);
    //   });
  }
);

//goto
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
                  .json({ msg: "Service catch error", err, success: false })
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
    .populate({ path: "category" })
    .then((foundService) => {
      if (foundService) {
        Reviews.find({ service: _id })
          .then((foundReviews) => {
            if (foundReviews.length > 0) {
              let sumRating = 0;
              let avgRating = 0;
              for (let k = 0; k < foundReviews.length; k++) {
                sumRating = foundReviews[k].rating + sumRating;
              }
              avgRating = sumRating / foundReviews.length;
              return res
                .json({
                  msg: "Service Found!",
                  foundService: foundService,
                  foundReviews: foundReviews,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({
                  msg: "Service Found!",
                  foundService: foundService,
                  // foundReviews: foundReviews,
                  success: true,
                })
                .status(200);
            }
          })
          .catch((err) => {
            console.log(err);
            return res.json({ msg: "Failed!", success: false }).status(505);
          });

        ///gooto
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
          for (let y = 0; y < certificateImgArray.length; y++) {
            let imgURLs = certificateImgArray[y];
            console.log("imgURLs");
            console.log(imgURLs);
            foundService.certificatesImgsURLs.push(imgURLs);
          }
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
                .json({ msg: "Service catch error", err, success: false })
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
