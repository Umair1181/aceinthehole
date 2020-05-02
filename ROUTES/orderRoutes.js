const Router = require("express").Router();

Router.use("/manage", require("../API/ORDER/order"));

module.exports = Router;
