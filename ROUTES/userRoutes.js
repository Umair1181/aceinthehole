const Router = require("express").Router();

Router.use("/auth", require("../API/USER/auth"));
Router.use("/wishlist", require("../API/SERVICES/wishlist"));
module.exports = Router;
