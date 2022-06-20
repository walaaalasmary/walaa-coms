const mongoose = require("mongoose");
const { Department } = require("./Department");

const committeSchema = mongoose.Schema({
  subject: {
    type: String,
    maxlength: 50,
  },
  beginPeriod: Date,
  endPeriod: Date,
  category: {
    type: String,
    default: "college",
  },
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Faculty" }],
  meetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }],
  university: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
  headOfCommitte: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
});
committeSchema.pre("save", function (next) {
  // add this department to the college array
  Department.findOneAndUpdate(
    { _id: this.department },
    {
      $push: { committees: this },
    }
  ).exec(() => {
    next();
  });
});
committeSchema.pre("remove", async function (next) {
  const doc = this;
  next();
});
const Committe = mongoose.model("Committe", committeSchema);

module.exports = { Committe };
