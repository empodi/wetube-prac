import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Create Account" });
};
export const postJoin = async (req, res) => {
  const { name, username, email, password, location } = req.body;
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
