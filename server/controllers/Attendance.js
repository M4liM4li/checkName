const prisma = require("../config/prisma");

exports.attendance = async (req, res) => {
  try {
    const { stdcode } = req.body;

    if (!stdcode) {
      return {
        status: 400,
        data: { message: "stdcode is required" },
      };
    }

    const user = await prisma.user.findFirst({
      where: { stdcode },
    });

    if (!user) {
      return {
        status: 404,
        data: { message: "User not found" },
      };
    }

    const check = await prisma.attendance.findFirst({
      where: {
        userID: user.id,
      },
    });

    if (check) {
      return {
        status: 400,
        data: { message: "Attendance already exists" },
      };
    }

    await prisma.attendance.create({
      data: {
        userID: user.id,
        status: true,
      },
    });

    return {
      status: 201,
      data: { message: "Attendance registered successfully" },
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      data: { message: "Server error" },
    };
  }
};
exports.listUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not logged in" });
    }

    // ดึงข้อมูลผู้ใช้
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        stdcode: true,
        fullname: true,
        image: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ดึงข้อมูลการเช็คชื่อ
    const attendance = await prisma.attendance.findMany({
      where: { userID: userId },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    res.json({
      success: true,
      user: user,
      attendanceRecords: attendance.map((record) => ({
        attendanceId: record.id,
        status: record.status ? "present" : "absent",
        time: record.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.listname = async (req, res) => {
  try {
    const name = await prisma.Attendance.findMany({
      include: {
        user: {
          select: {
            id: true,
            stdcode: true,
            fullname: true,
          },
        },
      },
    });
    res.send(name);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteName = async (req, res) => {
  try {
    const name = await prisma.Attendance.deleteMany();
    res.json({message:"ลบเสร็จสิ้น"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
