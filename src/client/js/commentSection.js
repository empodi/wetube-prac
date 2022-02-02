const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
//const btn = form.querySelector("button");

const addRealTimeComment = (text) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;

  newComment.appendChild(icon);
  newComment.appendChild(span);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  //console.log(videoContainer.dataset.id);
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;

  if (text === "") return;

  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    // "await" IMPORTANT!!!
    // fetch returns RESPONSE!!!
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";

  if (status === 201) {
    addRealTimeComment(text);
  }
};

if (form) {
  // for the case when a user is NOT LOGGED IN --> "form" doesn't exist
  form.addEventListener("submit" /** NOT CLICK!!! */, handleSubmit);
}
