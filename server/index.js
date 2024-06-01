import "./db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { adminRouter } from "./Routes/auth.js";
import { StudentRoutes } from "./Routes/StudentRoutes.js";
import { TArouter } from "./Routes/TAauth.js";
import { Facultyrouter } from "./Routes/Facultyauth.js";
import MarksRouter from "./Routes/MarksRoutes.js";
import { AttendenceRouter } from "./Routes/AttendenceRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("PORT environment variable is not defined.");
}

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3045"],
    credentials: true,
  })
);

app.use("/auth", adminRouter);
app.use("/student", StudentRoutes);
app.use("/ta", TArouter);
app.use("/faculty", Facultyrouter);
app.use("/marks", MarksRouter);
app.use("/attendance", AttendenceRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
