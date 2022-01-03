import e from "express";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Create Account" });
};
export const postJoin = async (req, res) => {
  const { name, username, email, password1, password2, location } = req.body;
  //const errorExists = await User.exists({ $or: [{ username }, { email }] });

  if (password1 !== password2) {
    return res.status(404).render("join", {
      pageTitle,
      errorMessage: "Password confirmation fail.",
    });
  }

  let errorType = "Username";
  const pageTitle = "Create Account";
  const userExists = await User.exists(username);
  const emailExists = await User.exists(email);

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
  await User.create({
    name,
    username,
    email,
    password,
    location,
  });
  return res.redirect("/login");
};
export const edit = (req, res) => {
  return res.send("Edit User");
};
export const remove = (req, res) => {
  return res.send("Remove user");
};
export const login = (req, res) => {
  return res.send("Login");
};
export const see = (req, res) => {
  return res.send("See User Profile");
};
export const logout = (req, res) => {
  return res.send("Logout");
};
