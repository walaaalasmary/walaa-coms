const express = require("express");
const router = express.Router();
const { University } = require("../models/University");

const { auth } = require("../middleware/auth");

//=================================
//             University services
//=================================

router.get("/:id", auth, (req, res) => {
  University.findOne({ _id: req.params.id }, (err, doc) => {
    if (!doc) return res.json({ success: false, err });
    else return res.status(200).json({ success: true, ...doc });
  });
});
router.post("/:id", (req, res) => {
  University.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      else return res.status(200).json({ success: true, ...doc });
    }
  );
});
router.get("/", auth, (req, res) => {
  var page = parseInt(req.params.page) || 0; //for next page pass 1 here
  var limit = parseInt(req.params.limit) || 3;
  University.find({})
    .skip(page * limit)
    .exec((err, doc) => {
      if (err) return res.status(400).json({ success: false, err });
      University.countDocuments({}).exec((countErr, count) => {
        if (countErr) return res.status(400).json({ success: false, countErr });
        return res.status(200).json({
          success: true,
          total: count,
          page: page,
          pageSize: doc.length,
          universities: doc,
        });
      });
    });
});
router.post("/", (req, res) => {
  const university = new University(req.body);
  university.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    else return res.status(200).json({ success: true, ...doc });
  });
});
router.delete("/:id", auth, async (req, res) => {
  try {
    await University.remove({ _id: req.params.id });
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
