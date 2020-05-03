const Router = require("express").Router();

Router.use("/manage", require("../API/ORDER/order"));
Router.use("/cart", require("../API/ORDER/cart"));

module.exports = Router;
