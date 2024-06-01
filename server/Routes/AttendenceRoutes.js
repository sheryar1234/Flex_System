// attendanceRoutes.js
import express from "express";
// import Attendance from "../models/Attendance.js";
import Attendance from "../models/attendence.js";
const router = express.Router();

// Store attendance record
router.post("/", async (req, res) => {
  try {
    const { studentId, status } = req.body;
    const attendance = new Attendance({ studentId, status });
    await attendance.save();
    res.send(attendance);
  } catch (error) {
    res.status(400).send(error);
  }
});

export { router as AttendenceRouter };
