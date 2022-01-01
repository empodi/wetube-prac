let videos = [
    {
        title: "New Year",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 1,
        id: 1,
    },
    {
        title: "Second Video",
        rating: 4,
        comments: 6,
        createdAt: "5 minutes ago",
        views: 25,
        id: 2,
    },
    {
        title: "Third third",
        rating: 2,
        comments: 8,
        createdAt: "1 minutes ago",
        views: 14,
        id: 3,
    }
]

export const trendingVideos = (req, res) => {
    return res.render("home", { pageTitle:"HOME", videos });
}
export const watch = (req, res) => {
    const id = req.params.id;   
    const video = videos[id - 1];

    //console.log(`Watch Video - id#${id}`);
    return res.render("watch", { pageTitle:`Watching ${video.title}`, video });
}
export const getEdit = (req, res) => {
    const id = req.params.id;
    const video = videos[id - 1];

    return res.render("edit", { pageTitle:`Editing: ${video.title}`, video });
}
export const postEdit = (req, res) => {
    const id = req.params.id;
    const video = videos[id - 1];

    videos[id - 1].title = req.body.title;

    return res.redirect(`/videos/${id}`);
}
