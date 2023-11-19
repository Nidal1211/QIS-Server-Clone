import { Router } from "express";
import {
  addExam,
  deleteExamById,
  getExamById,
  getExams,
} from "../controllers/exam.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const examRouter = Router();

examRouter.route("/add").post(verifyToken, addExam);
examRouter.route("/get").get(verifyToken, getExams);
examRouter.route("/get/:id").get(verifyToken, getExamById);
examRouter.route("/delete/:id").delete(verifyToken, deleteExamById);

export default examRouter;
