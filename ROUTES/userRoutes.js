const Router = require("express").Router();

Router.use("/auth", require("../API/USER/auth"));

module.exports = Router;
