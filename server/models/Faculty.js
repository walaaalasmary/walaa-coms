const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const moment = require("moment");
const resetPassword = require("../emails/reset-password");
const facultySchema = mongoose.Schema({
  firstName: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  phoneNumber: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minglength: 5,
    select: false,
  },
  lastName: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: String,
    default: "member",
    enum: [
      "admin",
      "dean",
      "head-of-department",
      "head-of-committee",
      "member",
      "reporter",
    ],
  },
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  university: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
  meeting: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" },
  committee: { type: mongoose.Schema.Types.ObjectId, ref: "Committee" },
  token: {
    type: String,
    select: false,
  },
  resetPasswordToken: {
    type: String,
    select: false,
  },
  tokenExp: {
    type: Number,
    select: false,
  },
  resetPasswordTokenExp: {
    type: Number,
    select: false,
  },
  beginPeriod: {
    type: Date,
  },
  endPeriod: {
    type: Date,
  },
  chatSecret: {
    type: String,
    select: true,
  },
});

facultySchema.pre("save", function (next) {
  // the user that is about to be saved
  var user = this;
  // if password is not empty
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        // user.password = 123
        user.password = hash;
        user.chatSecret = hash;
        next();
      });
    });
  } else {
    next();
  }
});
facultySchema.pre("findOneAndUpdate", function (next) {
  // the user that is about to be saved
  var user = this;
  // if password is not empty
  if (user._update.password) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user._update.password, salt, function (err, hash) {
        if (err) return next(err);
        user._update.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});
facultySchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

facultySchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), "secret");
  var oneHour = moment().add(1, "hour").valueOf();

  user.tokenExp = oneHour;
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

facultySchema.statics.findByToken = function (token, cb) {
  var user = this;

  jwt.verify(token, "secret", function (err, decode) {
    user
      .findOne({ _id: decode, token: token })
      .populate("college university department committee meeting")
      .exec(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
      });
  });
};
facultySchema.methods.resetPassword = function (email, cb) {
  //use nodemailer to email a reset link
  var user = this;
  var token = jwt.sign(user._id.toHexString(), "secret");
  var oneHour = moment().add(1, "hour").valueOf();

  user.resetPasswordTokenExp = oneHour;
  user.resetPasswordToken = token;
  user.save(function (err, user) {
    user.generateToken(function (err, user) {
      resetPassword(user, function (err, info) {
        if (err) return cb(err);
        cb(null, user);
      });
    });
  });
};
facultySchema.pre("remove", async function (next) {
  const doc = this;
  next();
});
const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = { Faculty };
