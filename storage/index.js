const multer = require("multer");
const BUCKET = "uploads";
const mongoose = require("mongoose");

const IMAGE_GET_BASE_URL = "/files/vendor-files/image/";
const CreateURL = filename => {
  return IMAGE_GET_BASE_URL + filename;
};
let gfs;
module.exports = () => {
  const mongoURI = require("../CONFIG/dbConfig").mongodbOnline;
  const mongo = mongoose.mongo;
  const storageConfig = require("./fileconfig");
  // gfs = Grid(global.mongodbconndbs, mongo);
  gfs = new mongoose.mongo.GridFSBucket(global.mongodbconndbs.db, {
    bucketName: BUCKET
  });
  const upload = multer({
    storage: storageConfig.InitializeStorage(
      mongoURI,
      global.mongodbconndbs,
      mongo
    )
  });

  return {
    upload,
    gfs,
    BUCKET,
    CreateURL
  };
};
