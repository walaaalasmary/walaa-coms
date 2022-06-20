const express = require("express");
const router = express.Router();
const { Department } = require("../models/Department");

const { auth } = require("../middleware/auth");

//=================================
//             Department services
//=================================

router.get("/:id", auth, (req, res) => {
  Department.findOne({ _id: req.params.id })
    .populate("university college headOfDepartment members")
    .exec((err, doc) => {
      if (!doc) return res.json({ success: false, err });
      else return res.status(200).json({ success: true, ...doc });
    });
});
router.get("/", auth, (req, res) => {
  var page = parseInt(req.query.page) || 0; //for next page pass 1 here
  var limit = parseInt(req.query.limit) || 3;
  delete req.query.page;
  delete req.query.limit;
  let query =
    req.faculty.role === "admin"
      ? { departmentName: { $regex: req.query.departmentName ?? "" } }
      : {
        departmentName: { $regex: req.query.departmentName ?? "" },
        college: req.faculty.college._id,
      };
  Department.find(query)
    .skip(page * limit)
    .populate("university college headOfDepartment members ")
    .exec((err, doc) => {
      if (err) console.error(err);
      if (err) return res.status(400).json({ success: false, err: err });
      Department.countDocuments({}).exec((countErr, count) => {
        if (countErr) return res.status(400).json({ success: false, countErr });
        return res.status(200).json({
          success: true,
          total: count,
          page: page,
          pageSize: doc.length,
          departments: doc,
        });
      });
    });
});
router.post("/:id", (req, res) => {
  Department.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      else return res.status(200).json({ success: true, ...doc });
    }
  );
});
router.post("/", (req, res) => {
  const department = new Department(req.body);
  department.save((err, doc) => {
    if (err) console.error(err);
    if (err) return res.json({ success: false, err });
    else return res.status(200).json({ success: true, ...doc });
  });
});
router.delete("/:id", auth, async (req, res) => {
  try {
    await Department.remove({ _id: req.params.id });
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
