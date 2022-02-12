// res.locals is initially empty
// anything can be added to res.locals object
// pug template can access res.locals for free
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const isHeroku = process.env.NODE_ENV === "production";

const multerUploader = multerS3({
  s3: s3,
  bucket: "wetube-empodi-2022",
  acl: "public-read",
});

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "wetube-empodi-2022/images",
  acl: "public-read",
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "wetube-empodi-2022/videos",
  acl: "public-read",
});

export const localsMiddleware = (req, res, next) => {
  /* LOCALS ARE AUTOMATICALLY IMPORTED TO VIEWS */
  res.locals.siteName = "WETUBE";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser =
    req.session.user ||
    {
      /* EMPTY OBJECT - In case if someone who isn't logged in tries to edit profile */
    };
  //console.log(res.locals);
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not authorized.");
    return res.redirect("/");
  }
};
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized.");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars",
  limits: { fileSize: 3000000 },
  storage: isHeroku ? s3ImageUploader : undefined,
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: { fileSize: 100000000 },
  storage: isHeroku ? s3VideoUploader : undefined,
});
/*
  NEVER SAVE A FILE ON A DATABASE!!!!! 
  SAVE THE LOCATION OF THE FILE ON A DATABASE
*/
