import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

// console.log(process.cwd());

const PORT = 4000;
const logger = morgan("dev");
const app = express();
app.use(logger);
app.set("view engine", "pug");  // no need for import
app.set("views", `${process.cwd()}/src/views`);
app.use(express.urlencoded({extended:true}));   // translates HTML form into javascript object (POST - req.body)
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);


const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🎸`);

app.listen(PORT /** port # */, handleListening/** event handling function */);