const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tourCategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  // trong nuoc, ngoai nuoc
  childName: {
    type: [String],
    required: true
  }
});

const tourCategory = mongoose.model(
  "tourCategory",
  tourCategorySchema
);
module.exports = tourCategory;
