// controllers/faceRecognitionController.js
const attendanceController = require("./Attendance");

exports.receiveFaceData = async (req, res) => {
  try {
    const { name } = req.body; // รับข้อมูลจาก body
    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Missing name",
      });
    }

    console.log("Received Face Data:", name);

    // เรียกใช้ attendance controller และรับผลลัพธ์จาก conAttendance
    const conAttendanceResult = await attendanceController.conAttendance({
      body: { stdcode: name },
    });

    if (conAttendanceResult.status === "success") {
      // เรียกใช้ attendanceController เพื่อบันทึกข้อมูลการเข้าร่วม
      const attendanceResult = await attendanceController.attendance({
        body: { stdcode: name },
      });

      // ส่งผลลัพธ์กลับไปยัง frontend
      return res.status(attendanceResult.status).json({
        status: attendanceResult.status < 400 ? "success" : "error",
        message: attendanceResult.data.message,
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Error processing data",
        error: conAttendanceResult.error,
      });
    }
  } catch (err) {
    console.error("Error in receive-face-data:", err);
    return res.status(500).json({
      status: "error",
      message: "Error processing data",
      error: err.message,
    });
  }
};
