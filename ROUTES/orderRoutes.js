const Router = require("express").Router();

Router.use("/manage", require("../API/ORDER/order"));
Router.use("/cart", require("../API/ORDER/cart"));
Router.use("/dispute", require("../API/ORDER/dispute"));

module.exports = Router;
