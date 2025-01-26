// controllers/faceRecognitionController.js
const attendanceController = require("./Attendance");

exports.receiveFaceData = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Missing name",
      });
    }

    console.log("Received Face Data:", name);

    // เรียกใช้ attendance controller และรับผลลัพธ์
    const attendanceResult = await attendanceController.attendance({
      body: { stdcode: name },
    });

    // ส่งผลลัพธ์กลับ
    return res.status(attendanceResult.status).json({
      status: attendanceResult.status < 400 ? "success" : "error",
      message: attendanceResult.data.message,
      name,
      attendanceStatus:
        attendanceResult.status === 201 ? "registered" : "failed",
    });
  } catch (err) {
    console.error("Error in receive-face-data:", err);
    return res.status(500).json({
      status: "error",
      message: "Error processing data",
      error: err.message,
    });
  }
};