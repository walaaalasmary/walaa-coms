const mongoose = require("mongoose");

const collegeSchema = mongoose.Schema({
  collegeName: {
    type: String,
    maxlength: 50,
  },
  collegeBuilding: {
    type: String,
    maxlength: 50,
  },
  collegeLink: {
    type: String,
  },
  departments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
  university: {
    type: mongoose.Types.ObjectId,
    ref: "University",
  },
  dean: {
    type: mongoose.Types.ObjectId,
    ref: "Faculty",
  },
});

const College = mongoose.model("College", collegeSchema);

module.exports = { College };
