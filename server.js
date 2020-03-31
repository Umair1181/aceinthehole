const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

/////////////////////BODY-PARSER CONFIGURATION /////////////////////////
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

///////////////FRONT END ERROR RESOLVED CODE /////////////////////
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
///////////////////DATABASE  CONFIGURATION/////////////////////
const db = require("./CONFIG/dbConfig").mongodbOnline;
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(m => {
    global.mongodbconndbs = m.connection;
    ///////////////// API ROUTES ////////////////
    app.use("/seller", require("./ROUTES/sellerRoutes"));
    app.use("/service", require("./ROUTES/sellerRoutes"));
    app.use("/files", require("./API/FIES/imageAPI"));
    app.get("/", (req, res) => {
      res.json({ msg: "server running..." }).status(200);
    });
    console.log(`DATABASE CONNEDCTED`);
  });
///////////// PORT ENVOIRMENT //////////////////
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
