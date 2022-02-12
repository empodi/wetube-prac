import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

/*
export const home = (req, res) => {
    Video.find({}, (error, videos) => {
        return res.render("home", { pageTitle:"HOME", videos });
        // rendering starts after searching is completed
    });
    // if there exists a code here, it may execute before the searching process above completes
};
*/

export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");

    if (res.locals.loggedIn == -false)
      req.flash("info", "Kakao Social Login Updated!!!");

    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  const owner = video.owner;
  const user = await User.findById(owner);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  return res.render("watch", { pageTitle: video.title, video, user });
};

export const getEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { id },
  } = req;

  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of this video.");
    return res.status(404).redirect("/");
  }
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, description, hashtags },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);

  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(404).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title: title,
    description: description,
    hashtags: Video.formatHashtags(hashtags), // static function
  });
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { title, description, hashtags },
    files: { video, thumb },
  } = req;

  try {
    const newVideo = await Video.create({
      title: title,
      owner: _id,
      description: description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      //createdAt: Date.now(), // default in VideoSchema
      hashtags: Video.formatHashtags(hashtags), // static function
      //meta: default in VideoSchema
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save(); // IMPORTANT!!!
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(404).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

const spliceCommentArray = (object, target) => {
  for (let i = 0; i < object.comments.length; i++) {
    if (String(object.comments[i]) === String(target)) {
      object.comments.splice(i, 1);
      break;
    }
  }
};

const spliceVideoArray = (object, target) => {
  console.log("splice video array function", object, target);
  for (let i = 0; i < object.videos.length; i++) {
    if (String(object.videos[i]) === String(target)) {
      console.log("GOT IT");
      object.videos.splice(i, 1);
      break;
    }
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);

  if (!video) {
    console.log("NO VIDEO");
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  const commentArray = video.comments;

  for (let i = 0; i < commentArray.length; i++) {
    const commentId = String(commentArray[i]);

    const commentObj = await Comment.findById(commentId);
    const Owner = await User.findById(String(commentObj.owner));

    spliceCommentArray(Owner, commentId);
    await Owner.save();

    await Comment.findByIdAndDelete(commentId);
  }

  const videoOwner = await User.findById(String(video.owner));

  spliceVideoArray(videoOwner, id);
  videoOwner.save();

  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404); // Send Status kills the request
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);
  const currentUser = await User.findById(user._id);

  if (!video || !currentUser) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    ownerName: currentUser.username,
    ownerAvatarUrl: currentUser.avatarUrl,
    video: id,
  });
  //console.log(comment);
  video.comments.push(comment._id);
  await video.save();
  currentUser.comments.push(comment._id);
  await currentUser.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id /* Video Id */ },
    body: { commentId },
    session: { user },
  } = req;
  const videoId = id;

  const comment = await Comment.findById(commentId);
  const currentVideo = await Video.findById(videoId);
  const currentUser = await User.findById(user._id);

  console.log("sesson-user id", user._id);

  console.log(commentId);

  if (!comment || !currentVideo || !currentUser) {
    return res.sendStatus(400);
  }

  if (String(comment.owner) !== String(currentUser._id)) {
    req.flash("error", "Not Authorized.");
    return res.sendStatus(403);
  }

  try {
    spliceCommentArray(currentUser, commentId);
    spliceCommentArray(currentVideo, commentId);
    await Comment.findByIdAndDelete(commentId);
    await currentUser.save();
    await currentVideo.save();
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
