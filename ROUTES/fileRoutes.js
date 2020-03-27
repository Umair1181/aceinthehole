const Router = require("express").Router();

Router.use("/files", require("../API/FIES/imageAPI"));

module.exports = Router;
