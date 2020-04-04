const { ServiceCategory, Service } = require("../../MODELS");
const Router = require("express").Router();

Router.post("/search-services-by-name", (req, res) => {
  const { serviceName } = req.body;

  let message = false;
  if (serviceName === "") {
    message = "Invalid serviceName";
  } else {
    message = false;
  }
  if (message === false) {
    Service.find({ serviceName: new RegExp(`^${serviceName}`, "i") })
      .then(foundServices => {
        if (foundServices.length > 0) {
          return res
            .json({
              msg: "Search Found",
              foundServices: foundServices,
              success: true
            })
            .status(200);
        } else {
          console.log("Not Found");
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
        return res.json({ msg: "catch error", success: false }).status(404);
      });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
});

Router.post("/search-categories-by-name", (req, res) => {
  const { categoryName } = req.body;

  let message = false;
  if (categoryName === "") {
    message = "Invalid categoryName";
  } else {
    message = false;
  }
  if (message === false) {
    ServiceCategory.find({
      serviceCategoryName: new RegExp(`^${categoryName}`, "i")
    })
      .then(foundCategories => {
        if (foundCategories.length > 0) {
          return res
            .json({
              msg: "Search Found",
              foundCategories: foundCategories,
              success: true
            })
            .status(200);
        } else {
          console.log("Not Found");
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
        return res.json({ msg: "catch error", success: false }).status(404);
      });
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
});
module.exports = Router;
