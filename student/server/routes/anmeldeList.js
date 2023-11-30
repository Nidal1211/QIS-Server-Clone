import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  cancelExam,
  getAnmeldeListe,
  registerForExam,
} from "../controllers/anmeldeList.js";
const ameldeListeRouter = Router();

ameldeListeRouter.route("/register").post(verifyToken, registerForExam);
ameldeListeRouter.route("/cancel/:examId").delete(verifyToken, cancelExam);
ameldeListeRouter
  .route("/get-registred-exam")
  .get(verifyToken, getAnmeldeListe);

export default ameldeListeRouter;
