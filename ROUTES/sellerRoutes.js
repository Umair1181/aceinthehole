const Router = require("express").Router();

Router.use("/auth",require("../API/SELER/auth"));

module.exports = Router;