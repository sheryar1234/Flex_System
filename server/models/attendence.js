// attendanceModel.js
import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
  date: { type: Date, default: Date.now }
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
