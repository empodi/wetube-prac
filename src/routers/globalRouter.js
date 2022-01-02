import express from "express";
import { home } from "../controllers/videoController";
import { join, login } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", home); // first page shown
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;
