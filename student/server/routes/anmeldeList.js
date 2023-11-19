import { Router } from "express";
import { login, logout } from "../controllers/auth.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { registerForExam } from "../controllers/anmeldeList.js";
const ameldeListeRouter = Router();

ameldeListeRouter.route("/exam-register").post(verifyToken, registerForExam);
ameldeListeRouter.route("/logout").get(logout);

export default ameldeListeRouter;
