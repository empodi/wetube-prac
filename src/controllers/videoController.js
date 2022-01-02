import req from "express/lib/request";
import Video from "../models/Video";

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
    const videos = await Video.find({}); // need async to use await
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }

  return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }

  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const { title, description, hashtags } = req.body;
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, {
    title: title,
    description: description,
    hashtags: hashtags
      .split(",")
      .map((word) => (word.startsWith("#") ? word : `#${word}`)),
  });
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;

  try {
    await Video.create({
      title: title,
      description: description,
      //createdAt: Date.now(), // default in VideoSchema
      hashtags: hashtags.split(",").map((word) => `#${word}`),
      //meta: default in VideoSchema
    });
    return res.redirect("/");
    ß;
  } catch (error) {
    console.log(error);
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
