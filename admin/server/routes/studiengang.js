import { Router } from "express";
import {
  addStudiengang,
  deleteStudiengangById,
  getStudiengang,
} from "../controllers/studiengang.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const studiengangRouter = Router();

studiengangRouter.route("/add").post(verifyToken, addStudiengang);
studiengangRouter.route("/get").get(verifyToken, getStudiengang);
studiengangRouter
  .route("/delete/:id")
  .delete(verifyToken, deleteStudiengangById);

export default studiengangRouter;
