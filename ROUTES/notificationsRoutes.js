const Router = require("express").Router();

Router.use("/token", require("../API/NOTIFICATIONS/token"));
Router.use("/manage", require("../API/NOTIFICATIONS/notifications"));

module.exports = Router;
