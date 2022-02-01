import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

// console.log(process.cwd());

const logger = morgan("dev");
const app = express();
app.use(logger);
app.set("view engine", "pug"); // no need for import
app.set("views", `${process.cwd()}/src/views`);

app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use(express.urlencoded({ extended: true })); // translates HTML form into javascript object (POST - req.body)

app.use(
  // should be located before Routers
  session({
    // this middleware will remember everybody who comes to the website
    // even not logged-in ones
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false, // gives cookie only to logged in users
    // uninitialized session is intialized in postLogin function
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localsMiddleware); // should be after session middleware
app.use("/uploads", express.static("uploads")); // allows browser to access the files inside the folder
app.use(
  "/assets",
  express.static("assets"),
  express.static("node_modules/@ffmpeg/core/dist")
);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
