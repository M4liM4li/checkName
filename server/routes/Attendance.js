const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const { listUsers, listname } = require("../controllers/Attendance");
const { attendance } = require("../controllers/Attendance");
const { receiveFaceData } = require("../controllers/faceRecognition");

router.post("/attendance", attendance);
router.post("/receiveFaceData", receiveFaceData);
router.get("/listname", listname);
router.get("/listUsers", authenticate, listUsers);

module.exports = router;
