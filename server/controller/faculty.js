const express = require("express");
const router = express.Router();
const { Faculty } = require("../models/Faculty");
var axios = require("axios");

const { auth } = require("../middleware/auth");

//=================================
//             Faculty Service
//=================================

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.faculty._id,
    isAdmin: req.faculty.role === 0 ? false : true,
    isAuth: true,
    email: req.faculty.email,
    firstName: req.faculty.firstName,
    lastName: req.faculty.lastName,
    phoneNumber: req.faculty.phoneNumber,
    role: req.faculty.role,
    chatSecret: req.faculty.chatSecret,
    college: req.faculty.college,
    university: req.faculty.university,
    department: req.faculty.department,
    committee: req.faculty.committee,
    meeting: req.faculty.meeting,
  });
});

router.post("/register", (req, res) => {
  const faculty = new Faculty({
    ...req.body,
    email: req.body.email.toLowerCase(),
  });

  faculty.save((error, doc) => {
    // failed
    if (error) return res.json({ success: false, error });
    const data = {
      username: doc.email,
      secret: doc.chatSecret,
      email: doc.email,
      first_name: doc.firstName,
      last_name: doc.lastName,
    };

    const config = {
      method: "post",
      url: "https://api.chatengine.io/users/",
      headers: {
        "PRIVATE-KEY": "4ada246c-1cd7-4835-adc7-8b609231271b",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        return res.status(200).json({
          success: true,
          doc: doc,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  });
});
router.post("/change-password", (req, res) => {
  Faculty.findOneAndUpdate(
    { resetPasswordToken: req.body.token },
    {
      password: req.body.password,
    },
    (error, doc) => {
      // failed
      if (error || !doc) return res.json({ success: false, error });
      Faculty.findOneAndUpdate(
        { _id: doc._id },
        { resetPasswordToken: "", resetPasswordTokenExp: "" },
        (err, doc) => {
          if (err) return res.json({ success: false, err });
          return res.status(200).json({
            success: true,
          });
        }
      );
    }
  );
});

router.post("/login", (req, res) => {
  Faculty.findOne(
    {
      email: {
        $regex: new RegExp(`^${req.body.email.toLowerCase()}`, "i"),
      },
    },
    "password",
    (err, faculty) => {
      // if not faculty
      if (!faculty)
        return res.json({
          loginSuccess: false,
          message: "Auth failed, email not found",
        });

      faculty.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({ loginSuccess: false, message: "Wrong password" });

        faculty.generateToken((err, faculty) => {
          if (err) return res.status(400).send(err);
          res.cookie("w_authExp", faculty.tokenExp);
          res.cookie("w_auth", faculty.token).status(200).json({
            loginSuccess: true,
            facultyId: faculty._id,
          });
        });
      });
    }
  );
});
router.post("/reset-password", (req, res) => {
  const email = req.body.email;
  Faculty.findOne(
    {
      email: {
        $regex: new RegExp(`^${req.body.email.toLowerCase()}`, "i"),
      },
    },
    (err, faculty) => {
      if (!faculty)
        return res.json({
          success: false,
          message: "Email not found",
        });

      faculty.resetPassword(email, (err, faculty) => {
        if (err)
          return res.json({
            success: false,
            error: err,
          });
        return res.json({
          success: true,
          message: "Check your email",
        });
      });
    }
  );
});
router.get("/logout", auth, (req, res) => {
  Faculty.findOneAndUpdate(
    { _id: req.faculty._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      res.cookie("w_authExp", null);
      return res.cookie("w_auth", null).status(200).json({
        facultyId: null,
        success: true,
      });
    }
  );
});
router.get("/deans", auth, (req, res) => {
  Faculty.find(
    {
      role: "dean",
    },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
        deans: doc,
      });
    }
  );
});
router.get("/", auth, (req, res) => {
  let page = parseInt(req.query.current - 1) || 0; //for next page pass 1 here
  let limit = parseInt(req.query.pageSize) || 3;
  let query =
    req.faculty.role === "admin"
      ? {
        firstName: { $regex: req.query.firstName ?? "" },
        lastName: { $regex: req.query.lastName ?? "" },
      }
      : {
        college: req.faculty.college._id,
        firstName: { $regex: req.query.firstName ?? "" },
        lastName: { $regex: req.query.lastName ?? "" },
      };
  Faculty.find(query)
    .populate("university college department")
    .skip(page * limit)
    .exec((err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
        users: doc.map((doc) => {
          return {
            _id: doc._id,
            email: doc.email,
            firstName: doc.firstName,
            lastName: doc.lastName,
            role: doc.role,
            university: doc.university,
            college: doc.college,
            department: doc.department,
            phoneNumber: doc.phoneNumber,
          };
        }),
      });
    });
});
router.post("/", (req, res) => {
  const faculty = new Faculty({
    ...req.body,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
  });

  faculty.save((error, doc) => {
    // failed
    if (error) return res.json({ success: false, error });
    const data = {
      username: doc.email,
      secret: doc.chatSecret,
      email: doc.email,
      first_name: doc.firstName,
      last_name: doc.lastName,
    };
    const config = {
      method: "post",
      url: "https://api.chatengine.io/users/",
      headers: {
        "PRIVATE-KEY": "4ada246c-1cd7-4835-adc7-8b609231271b",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        return res.status(200).json({
          success: true,
          doc: doc,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  });
});
router.post("/:id", (req, res) => {
  Faculty.findOneAndUpdate(
    { _id: req.params.id },
    {
      ...req.body,
    },
    (error, doc) => {
      // failed
      if (error || !doc) return res.json({ success: false, error });
      return res.status(200).json({ success: true });
    }
  );
});
router.delete("/:id", auth, async (req, res) => {
  try {
    await Faculty.remove({ _id: req.params.id });
    return res
      .status(200)
      .json({ success: true, message: "deleted successfully" });
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .json({ success: false, message: "failed to delete" });
  }
});
module.exports = router;
