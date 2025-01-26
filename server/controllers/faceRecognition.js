const attendanceController = require("./Attendance");

exports.receiveFaceData = async (req, res) => {
  try {
    const { name, isConfirmed } = req.body; // Expecting isConfirmed to be sent from the frontend
    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Missing name",
      });
    }

    console.log("Received Face Data:", name);

    // If the confirmation result is not provided or is false, return an error
    if (!isConfirmed) {
      return res.status(400).json({
        status: "error",
        message: "Name confirmation failed or cancelled.",
      });
    }

    // Proceed with the attendance process if the name is confirmed
    const attendanceResult = await attendanceController.attendance({
      body: { stdcode: name },
    });

    // Return the result of the attendance process
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
