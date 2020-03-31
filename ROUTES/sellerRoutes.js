const Router = require("express").Router();

Router.use("/auth", require("../API/SELER/auth"));
Router.use("/servicemanage", require("../API/SERVICES/service"));

module.exports = Router;
