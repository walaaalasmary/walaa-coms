const mongoose = require("mongoose");

const universitySchema = mongoose.Schema({
  universityName: {
    type: String,
    maxlength: 50,
  },
  universityID: mongoose.Schema.ObjectId,
  colleges: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
});
universitySchema.pre("remove", async function (next) {
  const doc = this;
  next();
});
const University = mongoose.model("University", universitySchema);

module.exports = { University };
