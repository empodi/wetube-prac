const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll("#delete__comment");

const addRealTimeComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments-container ul");
  const newComment = document.createElement("li");
  const comment__container = document.getElementsByClassName(
    "video__comments-container"
  );
  newComment.dataset.comment_id = id;
  newComment.className = "video__comment";

  const user = comment__container[0].dataset.loggedinuser;
  userObj = JSON.parse(user);

  const commentBox = document.createElement("div");
  commentBox.className = "comment__box";

  const commentOwner = document.createElement("div");
  commentOwner.className = "comment__owner";

  const commentDate = document.createElement("span");
  commentDate.innerText = String(
    new Date().toLocaleDateString({
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
  commentDate.className = "comment__created-at";

  const userName = document.createElement("span");
  userName.innerText = userObj.username;
  userName.className = "comment__user-name";
  if (userObj.avatarUrl !== "") {
    const userImg = document.createElement("img");
    userImg.setAttribute("src", userObj.avatarUrl);
    userImg.crossOrigin = "crossorigin";

    const userName = document.createElement("span");
    userName.innerText = userObj.username;
    commentOwner.appendChild(userImg);
  } else {
    const userImg = document.createElement("span");
    userImg.innerText = "😀";
    commentOwner.appendChild(userImg);
  }
  commentOwner.appendChild(userName);
  commentOwner.appendChild(commentDate);

  const textContent = document.createElement("span");
  textContent.innerText = ` ${text}`;

  const commentContent = document.createElement("div");
  commentContent.className = "comment__content";
  commentContent.appendChild(textContent);

  const delButton = document.createElement("button");
  delButton.id = "delete__comment";
  delButton.dataset.comment_id = id;
  delButton.innerText = "Delete Comment";
  delButton.addEventListener("click", handleDeleteComment);

  newComment.appendChild(commentOwner);
  newComment.appendChild(commentContent);
  newComment.appendChild(delButton);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value.trim().replace(/\n+$/, "");
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

const handleDeleteComment = async (event) => {
  const videoId = videoContainer.dataset.id;
  const commentId = event.target.dataset.comment_id;

  const response = await fetch(`/api/videos/${videoId}/comment-delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });

  const { status } = response;

  if (status === 201) {
    const commentContainer = document.querySelector(
      ".video__comments-container ul"
    );

    const commentArray = commentContainer.childNodes;

    for (let i = 0; i < commentArray.length; i++) {
      if (commentArray[i].dataset.comment_id === commentId) {
        commentContainer.removeChild(commentArray[i]);
        break;
      }
    }
  }
};

if (form) {
  // for the case when a user is NOT LOGGED IN --> "form" doesn't exist
  form.addEventListener("submit" /** NOT CLICK!!! */, handleSubmit);
}

for (let i = 0; i < deleteBtn.length; i++) {
  deleteBtn[i].addEventListener("click", handleDeleteComment);
}
