// res.locals is initially empty
// anything can be added to res.locals object
// pug template can access res.locals for free

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "WETUBE";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  //console.log(res.locals);
  next();
};
