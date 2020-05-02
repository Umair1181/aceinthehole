const Router = require("express").Router();
const { Order, Reviews } = require("../../MODELS");

////////////////////////////////////////////////////////////////
Router.post("/add-new-review", (req, res) => {
  let { orderID, serviceID, userID, description, rating } = req.body;

  let newReviews = new Reviews({
    order: orderID,
    service: serviceID,
    user: userID,
    description: description,
    rating: rating,
  });

  newReviews
    .save()
    .then((reviewSaved) => {
      if (reviewSaved) {
        return res
          .json({ msg: "newReview Created", reviewSaved, success: true })
          .status(200);
      } else {
        return res
          .json({ msg: "No Review Created", success: false })
          .status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});

/////////////////////////////////////////////////////////////////
Router.post("/show-orders-of-specific-user", (req, res) => {
  let { userID } = req.body;

  Order.find({ user: userID })
    .then((foundOrders) => {
      if (foundOrders.length > 0) {
        return res
          .json({ msg: "Found Orders", foundOrders, success: true })
          .status(200);
      } else {
        return res.json({ msg: "Empty", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});
////////////////////////////////////////////////////////////////
Router.post("/place-order-of-service-by-user", (req, res) => {
  let { serviceID, userID, description, price, day, time } = req.body;

  let newOrder = new Order({
    service: serviceID,
    user: userID,
    description: description,
    price: price,
    reqDay: day,
    reqTime: time,
  });

  newOrder
    .save()
    .then((orderSaved) => {
      if (orderSaved) {
        return res
          .json({ msg: "Order Created", orderSaved, success: true })
          .status(200);
      } else {
        return res
          .json({ msg: "Order Not Created", success: false })
          .status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed", success: false }).status(404);
    });
});

module.exports = Router;
