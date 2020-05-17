const Router = require("express").Router();

/////////////////////////// chat Routes  ///////////////////////////////////////////
Router.use("/message-box", require("../API/CHAT/message"));

module.exports = Router;
