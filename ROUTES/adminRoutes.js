const Router = require("express").Router();

Router.use("/auth", require("../API/ADMIN/auth"));
Router.use("/manage", require("../API/ADMIN/admin"));
Router.use("/configs", require("../API/ADMIN/config"));
module.exports = Router;
