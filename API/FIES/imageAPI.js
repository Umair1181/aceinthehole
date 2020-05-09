const Router = require("express").Router();
const { gfs, BUCKET } = require("../../storage")();
const mongoose = require("mongoose");
Router.get("/vendor-files/image/:filename", (req, res) => {
  console.log("Calling api with filename");
  console.log(req.params.filename);
  gfs.find({ filename: req.params.filename }).toArray((err, file) => {
    console.log("File");
    console.log(file);
    console.log(err);
    if (!file || file.length === 0) {
      console.log("Inside error");
      return res.json({ msg: "no files" }).status(404);
    }
    // const readStream = gfs.createReadStream(file.filename);
    // readStream.pipe(res);
    console.log("downlading image");
    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
  });
});

Router.post("/files/del/:filename", (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, file) => {
    // return res.json(req.params.filename);
    if (!file || file.length === 0) {
      console.log("Inside error");
      return res.json({ msg: "no such files" }).status(404);
    }
    gfs.delete(new mongoose.Types.ObjectId(file[0]._id), (err, data) => {
      if (err) return res.status(404).json({ err: err.message, data });
      return res
        .json({ msg: "File Deleted", id: req.params.id, success: true })
        .status(200);
      // res.redirect("/");
    });
  });
});

module.exports = deleteImgFile = async (fileName) => {
  let fileNameBy = "6442e01855d2056e88a96e3e1afa0fb1.png";

  await gfs.find({ filename: fileNameBy }).toArray(async (err, file) => {
    // return res.json(file[0]._id);
    if (!file || file.length === 0) {
      console.log("Inside error");
      return res.json({ msg: "no such files" }).status(404);
    }
    await gfs.delete(new mongoose.Types.ObjectId(file[0]._id), (err, data) => {
      if (err) {
        return res.status(404).json({ err: err.message, data });
      }
      return "File Deleted";
      // res
      //   .json({ msg: "File Deleted", id: req.params.id, success: true })
      //   .status(200);
      // res.redirect("/");
    });
  });
};

module.exports = Router;
