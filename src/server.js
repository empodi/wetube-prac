import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

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
app.use("/assets", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
