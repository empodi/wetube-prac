import express from "express";
import {
  edit,
  remove,
  see,
  logout,
  githubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/delete", remove);
userRouter.get("/github/start", githubLogin);
userRouter.get(":id", see);

export default userRouter;
