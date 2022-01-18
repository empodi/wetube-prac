import e from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import { token } from "morgan";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Create Account" });
};
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  //const errorExists = await User.exists({ $or: [{ username }, { email }] });

  if (password !== password2) {
    return res.status(404).render("join", {
      pageTitle,
      errorMessage: "Password confirmation fail.",
    });
  }

  let errorType = "Username";
  const pageTitle = "Create Account";
  const userExists = await User.exists({ username });
  const emailExists = await User.exists({ email });

  if (userExists && emailExists)
    return res.status(404).render("join", {
      pageTitle,
      errorMessage: "Username and Email are already taken.",
    });
  if (emailExists) errorType = "Email";
  if (userExists || emailExists) {
    return res.status(404).render("join", {
      pageTitle,
      errorMessage: `${errorType} is already taken.`,
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};
export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Log In" });
};
export const postLogin = async (req, res) => {
  const pageTitle = "Log In";
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });

  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Username doesn't exist",
    });
  }

  const dbPassword = user.password;
  const pwdConfirm = await bcrypt.compare(password, dbPassword);

  if (!pwdConfirm) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }

  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};
export const edit = (req, res) => {
  return res.send("Edit User");
};
export const remove = (req, res) => {
  return res.send("Remove user");
};
export const see = (req, res) => {
  return res.send("See User Profile");
};
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT_ID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = baseUrl + "?" + params;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
  //exchange the token github gave us to access token
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT_ID,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = baseUrl + "?" + params;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: { Accept: "application/json" },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    //console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    //console.log(emailData);
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) return res.redirect("/login");

    let user = await User.findOne({ email: emailObj.email });
    // check if there is already a user with same email from github
    if (!user) {
      // create an account
      user = await User.create({
        name: userData.name,
        avatarUrl: userData.avatar_url,
        socialOnly: true,
        username: userData.login,
        email: emailObj.email,
        password: "",
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};
