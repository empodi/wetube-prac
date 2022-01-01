import express from "express";
import { trendingVideos } from "../controllers/videoController";
import { join } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", trendingVideos); // first page shown
globalRouter.get("/join", join);

export default globalRouter;
