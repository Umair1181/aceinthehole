const Router = require("express").Router();
const { Order, Reviews } = require("../../MODELS");
////////////////////////////////////////////////////////////////
Router.post("/show-all-orders-in-system", (req, res) => {
  Order.find().then((foundOrders) => {
    if (foundOrders.length > 0) {
      return res
        .json({
          msg: `Orders`,
          noOfOrders: foundOrders.length,
          foundOrders,
          success: true,
        })
        .status(202);
    } else {
      return res.json({ msg: `No Order`, success: false }).status(404);
    }
  });
});

////////////////////////////////////////////////////////////////
Router.post("/show-orders-with-status", (req, res) => {
  let { orderStatus } = req.body;

  Order.find({ orderStatus: orderStatus }).then((foundOrders) => {
    if (foundOrders.length > 0) {
      return res
        .json({
          msg: `${orderStatus}ED Orders`,
          noOfOrders: foundOrders.length,
          foundOrders,
          success: true,
        })
        .status(202);
    } else {
      return res.json({ msg: `No Order`, success: false }).status(404);
    }
  });
});

////////////////////////////////////////////////////////////////
Router.post("/change-order-status", (req, res) => {
  let { orderID, orderStatus } = req.body;
  Order.findOne({ _id: orderID })
    .then((foundOrder) => {
      if (foundOrder !== null) {
        foundOrder.orderStatus = orderStatus;
        foundOrder
          .save()
          .then((savedOrder) => {
            if (savedOrder) {
              return res
                .json({
                  msg: `Order status=${savedOrder.orderStatus}`,
                  savedOrder,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({
                  msg: `Order status=${foundOrder.orderStatus}`,
                  success: false,
                })
                .status(505);
            }
          })
          .catch((err) => {
            console.log(err);
            return res.json({ msg: "Failed!", success: false }).status(505);
          });
      } else {
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

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
    .populate({
      path: "user",
    })
    .populate({
      path: "service",
    })
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
    .then(async (orderSaved) => {
      if (orderSaved) {
        let foundOrder = await Order.findOne({ _id: orderSaved._id })
          .populate({
            path: "user",
          })
          .populate({
            path: "service",
          });
        return res
          .json({ msg: "Order Created", orderSaved: foundOrder, success: true })
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
