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

    const user = await prisma.user.findFirst({
      where: { stdcode },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

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

    // ทำการบันทึกการเช็คชื่อเฉพาะเมื่อผู้ใช้ยืนยัน
    await prisma.attendance.create({
      data: {
        userID: user.id,
        status: true,
      },
    });

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
