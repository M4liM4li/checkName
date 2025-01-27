const prisma = require("../config/prisma");

exports.attendance = async (req, res) => {
  try {
    const { name: stdcode, confirm } = req.body; // เพิ่ม `confirm` เพื่อรับการยืนยัน

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

    // ถ้ายังไม่มีการยืนยัน ให้ส่งข้อมูลผู้ใช้ไปให้ client
    if (!confirm) {
      return res.status(200).json({
        status: "success",
        message: "User found. Confirm to register attendance.",
        user,
      });
    }

    // บันทึกการเข้าเรียนใหม่ (เมื่อ client ส่ง confirm: true)
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
    console.error("Error in attendance:", err);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};