import User from "../models/User";
import Video from "../models/Video";
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
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation fail.",
    });
  }

  let errorType = "Username";
  const pageTitle = "Create Account";
  const userExists = await User.exists({ username });
  const emailExists = await User.exists({ email });

  if (userExists && emailExists)
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Username and Email are already taken.",
    });
  if (emailExists) errorType = "Email";
  if (userExists || emailExists) {
    return res.status(400).render("join", {
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
export const remove = (req, res) => {
  return res.send("Remove user");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User Not Found." });
  }

  // identical to populate
  const videos = await Video.find({ owner: user._id });

  return res.render("profile", {
    pageTitle: `${user.username}'s Profile`,
    user,
    videos,
  });
};

export const userProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User Not Found." });
  }

  const videos = await Video.find({ owner: user._id });

  return res.render("user-profile", {
    pageTitle: `${user.username}'s Profile`,
    user,
    videos,
  });
};

export const logout = (req, res) => {
  req.session.user = null;
  res.locals.loggedInUser = req.session.user;
  req.session.loggedIn = false;
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
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    // check if there is already a user with same email from github
    if (!user) {
      // create an account if user doesn't exist
      user = await User.create({
        name: userData.name,
        avatarUrl: userData.avatar_url,
        socialOnly: true,
        username: userData.login,
        email: emailObj.email,
        password: "",
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req; //ES6!!!
  console.log(file);
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.location : avatarUrl,
      name: name,
      email: email,
      username: username,
      location: location,
    },
    { new: true }
  );
  req.session.user = updatedUser;

  return res.render("edit-profile");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Can't change password.");
    console.log(req.session.user.socialOnly);
    return res.redirect("/"); // later add notification
  }
  return res.render("change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    body: { curPassword, newPwd, newPwdConfirm },
    session: {
      user: { _id },
    },
  } = req;

  if (newPwd !== newPwdConfirm) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "New passwords doesn't match.",
    });
  }

  const user = await User.findById(_id);
  const isValid = await bcrypt.compare(curPassword, user.password);
  if (!isValid) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect.",
    });
  }
  user.password = newPwd;
  await user.save(); // important
  req.flash("info", "Password Updated.");
  return res.redirect("/");
};

export const startKakaoLogin = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";

  const kakao = {
    client_id: process.env.KAKAO_CLIENT,
    response_type: "code",
    redirect_uri: "https://wetube-cloning.herokuapp.com/users/kakao/finish",
    scope: "profile_nickname,profile_image,account_email,gender",
  };

  const params = new URLSearchParams(kakao).toString();

  const finalUrl = `${baseUrl}?${params}`;

  return res.redirect(finalUrl);
};

export const finsihKakaoLogin = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";

  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_CLIENT,
    //client_secret: process.env.KAKAO_SECRET,
    redirect_uri: "https://wetube-cloning.herokuapp.com/users/kakao/finish",
    code: req.query.code,
  };

  const params = new URLSearchParams(config).toString();

  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const userData = await (
      await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    const {
      kakao_account: {
        email,
        profile: { profile_image_url, is_default_image },
      },
      properties: { nickname },
    } = userData;

    console.log("is_default_image: ", is_default_image);
    console.log("profile_image_url: ", profile_image_url);

    if (!email || !nickname || (!is_default_image && !profile_image_url)) {
      return res.redirect("/login", {
        errorMessage: "Failed to get your information.",
      });
    }

    const username = email.split("@")[0];

    let user = await User.findOne({
      email: email,
    });

    if (!user) {
      user = await User.create({
        name: nickname,
        email: email,
        username: username,
        avatarUrl: is_default_image ? "" : profile_image_url,
        password: "",
        socialOnly: true,
        location: "",
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
