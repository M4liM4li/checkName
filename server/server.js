const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const authRouter = require("./routes/auth");
const attendanceRouter = require("./routes/Attendance");

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api", authRouter);
app.use("/api", attendanceRouter);

app.listen(5000, () => console.log("server running on port 5000"));

module.exports = app;
