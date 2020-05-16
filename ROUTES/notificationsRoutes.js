const Router = require("express").Router();

Router.use("/token", require("../API/NOTIFICATIONS/token"));

module.exports = Router;
