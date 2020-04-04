const Router = require("express").Router();

Router.use("/auth", require("../API/SELER/auth"));
Router.use("/servicemanage", require("../API/SERVICES/service"));
Router.use("/search", require("../API/SERVICES/search"));

module.exports = Router;
