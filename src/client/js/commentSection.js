const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll("#delete__comment");
const videoComment = document.getElementsByClassName("video__comment");
//const btn = form.querySelector("button");

const addRealTimeComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const del_span = document.createElement("button");
  del_span.id = "delete__comment";
  del_span.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(del_span);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  //console.log(videoContainer.dataset.id);
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;

  if (text === "") return;

  const response = await fetch(`/api/videos/${videoId}/comment-create`, {
    // "await" IMPORTANT!!!
    // fetch returns RESPONSE!!!
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  const { newCommentId } = await response.json();

  if (response.status === 201) {
    addRealTimeComment(text, newCommentId);
  }
};

if (form) {
  // for the case when a user is NOT LOGGED IN --> "form" doesn't exist
  form.addEventListener("submit" /** NOT CLICK!!! */, handleSubmit);
}

const handleDeleteComment = async (event) => {
  const videoId = videoContainer.dataset.id;
  const commentId = event.target.dataset.comment_id;
  console.log("handleComment: ", commentId);

  console.log("commentID: ", commentId);

  const response = await fetch(`/api/videos/${videoId}/comment-delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });

  const { status } = response;

  if (status === 201) {
    const commentContainer = document.querySelector(".video__comments ul");

    const commentArray = commentContainer.childNodes;

    for (let i = 0; i < commentArray.length; i++) {
      if (commentArray[i].dataset.comment_id === commentId) {
        commentContainer.removeChild(commentArray[i]);
        break;
      }
    }
  }
};

for (let i = 0; i < deleteBtn.length; i++) {
  deleteBtn[i].addEventListener("click", handleDeleteComment);
}
