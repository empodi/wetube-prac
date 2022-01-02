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

export const watch = (req, res) => {
    const id = req.params.id;   

    //console.log(`Watch Video - id#${id}`);
    return res.render("watch", { pageTitle:`Watching`});
};
export const getEdit = (req, res) => {
    const id = req.params.id;

    return res.render("edit", { pageTitle:`Editing`});
};
export const postEdit = (req, res) => {
    const id = req.params.id;

    return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle:"Upload Video" });
};
export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    
    const video = new Video({
        title: title,
        description: description,
        createdAt: Date.now(),
        hashtags: hashtags.split(",").map(word=>`#${word}`),
        meta: {
            views: 0,
            rating: 0
        },
    });
    const dbVideo = await video.save();
    
    return res.redirect("/");
};