const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceCategory = new Schema({
  serviceCategoryName: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("tblservicecategorys", ServiceCategory);
