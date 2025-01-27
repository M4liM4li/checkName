const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const { listUsers, listname, deleteName } = require("../controllers/user");
const { attendance } = require("../controllers/Attendance");

router.post("/attendance", attendance);
router.get("/listname", listname);
router.get("/listUsers", listUsers);
router.delete("/delete-names", deleteName);

module.exports = router;
