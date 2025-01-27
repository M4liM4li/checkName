const prisma = require("../config/prisma");

exports.attendance = async (req, res) => {
  try {
    const { name: stdcode } = req.body;

    if (!stdcode) {
      return res.status(400).json({
        status: "error",
        message: "Missing stdcode",
      });
    }

    console.log("Received Face Data:", stdcode);

    // ค้นหาผู้ใช้ในฐานข้อมูล
    const user = await prisma.user.findFirst({
      where: { stdcode },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // ตรวจสอบว่ามีการบันทึกการเข้าเรียนแล้วหรือยัง
    const check = await prisma.attendance.findFirst({
      where: {
        userID: user.id,
      },
    });

    if (check) {
      return res.status(400).json({
        status: "error",
        message: "Attendance already exists",
      });
    }

    // บันทึกการเข้าเรียนใหม่
    await prisma.attendance.create({
      data: {
        userID: user.id,
        status: true,
      },
    });

    // ส่งผลลัพธ์สำเร็จกลับไป
    return res.status(201).json({
      status: "success",
      message: "Attendance registered successfully",
      name: stdcode,
      attendanceStatus: "registered",
    });
  } catch (err) {
    console.error("Error in receive-face-data:", err);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};
