const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found!" });
    }

    if (password !== user.password) {
      return res.status(400).json({ success: false, message: "Invalid password!" });
    }

    const payload = {
      id: user.id,
      email: user.username,
      role: user.role,
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: "1d",
      },
      (err, token) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Server error" });
        }
        res.json({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            fullname: user.fullname,
            image: user.image, 
          },
          token,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
