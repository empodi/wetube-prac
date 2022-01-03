import e from "express";
import User from "../models/User";
import bcrypt from "bcrypt";

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
  const user = await User.findOne({ username });

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
  return res.send("Logout");
};
