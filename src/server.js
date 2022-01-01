import express from "express";
import morgan from "morgan";

const PORT = 4000;
const logger = morgan("dev");
const app = express();
app.use(logger);

const globalRouter = express.Router();
const userRouter = express.Router();
const videoRouter = express.Router();

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleHome = (req, res) => {
    res.send("Home");
}
const handleEditUser = (req, res) => {
    res.send("Edit User");
}
const handleWatchVideo = (req, res) => {
    res.send("Watch Videos");
}

globalRouter.get("/", handleHome);
userRouter.get("/edit", handleEditUser);
videoRouter.get("/watch", handleWatchVideo);

const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🎸`);

app.listen(PORT /** port # */, handleListening/** event handling function */);