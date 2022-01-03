import express from "express";
import morgan from "morgan";
import session from "express-session";
import globalRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

// console.log(process.cwd());

const logger = morgan("dev");
const app = express();
app.use(logger);
app.set("view engine", "pug"); // no need for import
app.set("views", `${process.cwd()}/src/views`);
app.use(express.urlencoded({ extended: true })); // translates HTML form into javascript object (POST - req.body)

app.use(
  // should be located before Routers
  session({
    // this middleware will remember everybody who comes to the website
    // even the not logged in ones
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
