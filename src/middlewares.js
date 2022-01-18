// res.locals is initially empty
// anything can be added to res.locals object
// pug template can access res.locals for free

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
    return res.redirect("/");
  }
};
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
