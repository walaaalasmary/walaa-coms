const express = require("express");
const router = express.Router();
const { Committe } = require("../models/Committe");

const { auth } = require("../middleware/auth");

//=================================
//             Committe services
//=================================

router.get("/:id", auth, (req, res) => {
  Committe.findOne({ _id: req.params.id }, (err, doc) => {
    if (!doc) return res.json({ success: false, err });
    else return res.status(200).json({ success: true, ...doc });
  });
});
router.post("/:id", (req, res) => {
  Committe.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      else return res.status(200).json({ success: true, ...doc });
    }
  );
});
router.get("/", auth, (req, res) => {
  let page = parseInt(req.query.current - 1) || 0; //for next page pass 1 here
  let limit = parseInt(req.query.pageSize) || 3;
  let query =
    req.faculty.role === "admin"
      ? { subject : { $regex: req.query.committeeName ?? "" } }
      : {
        subject: { $regex: req.query.committeeName ?? "" },
      };
  Committe.find(query)
    .populate("headOfCommitte reporter university college department")
    .skip(page * limit)
    .exec((err, doc) => {
      if (err) return res.status(400).json({ success: false, err });
      Committe.countDocuments(query).exec((countErr, count) => {
        if (countErr) return res.status(400).json({ success: false, countErr });
        return res.status(200).json({
          success: true,
          total: count,
          page: page,
          pageSize: doc.length,
          committes: doc,
        });
      });
    });
});
router.post("/", (req, res) => {
  const committe = new Committe(req.body);
  committe.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    else return res.status(200).json({ success: true, ...doc });
  });
});
router.delete("/:id", auth, async (req, res) => {
  try {
    await Committe.remove({ _id: req.params.id });
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
