const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const { listUsers, listname,deleteName} = require("../controllers/Attendance");
const {receiveFaceData} = require("../controllers/receiveFaceData");
const { receiveFaceData } = require("../controllers/faceRecognition");

router.post("/receiveFaceData", receiveFaceData); 
router.get("/listname", listname); 
router.get("/listUsers", authenticate, listUsers);
router.delete("/delete-names", deleteName);

module.exports = router;