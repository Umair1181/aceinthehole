const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Admin = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  RandomNumber: {
    type: String,
    default: null,
  },
  webFcToken: {
    type: String,
    default: null,
  },
  mobileFcToken: {
    type: String,
    default: null,
  },
});
module.exports = mongoose.model("tbladmins", Admin);
