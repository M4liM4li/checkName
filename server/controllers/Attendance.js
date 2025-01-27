const prisma = require("../config/prisma");

exports.attendance = async (req, res) => {
  try {
    const { name: stdcode, confirm } = req.body;

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

    if (!confirm) {
      return res.status(200).json({
        status: "success",
        message: "User found. Confirm to register attendance.",
        user,
      });
    }

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
