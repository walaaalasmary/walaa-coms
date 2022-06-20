const mongoose = require("mongoose");
const { College } = require("./College");

const departmentSchema = mongoose.Schema({
  departmentName: {
    type: String,
    maxlength: 50,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    set: function (college) {
      this._college = this.college;
      return college;
    },
  },
  university: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
  headOfDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },
  ],
  committees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Committe",
    },
  ],
});

departmentSchema.pre("save", function (next) {
  // add this department to the college array
  College.findOneAndUpdate(
    { _id: this.college },
    {
      $push: { departments: this },
    }
  ).exec(() => {
    next();
  });
});
departmentSchema.pre("remove", async function (next) {
  const doc = this;
  next();
});
const Department = mongoose.model("Department", departmentSchema);

module.exports = { Department };
