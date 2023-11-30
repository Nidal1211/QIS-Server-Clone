import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getNotenspiegel } from "../controllers/notenspiegel.js";
const notenspiegelRouter = Router();

notenspiegelRouter.route("/get").get(verifyToken, getNotenspiegel);


export default notenspiegelRouter;

