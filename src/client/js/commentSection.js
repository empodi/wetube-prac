const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
//const btn = form.querySelector("button");

const handleSubmit = async (event) => {
  event.preventDefault();
  //console.log(videoContainer.dataset.id);
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;

  if (text === "") return;

  await fetch(`/api/videos/${videoId}/comment`, {
    // "await" IMPORTANT!!!
    // fetch returns RESPONSE!!!
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
};

if (form) {
  // for the case when a user is NOT LOGGED IN --> "form" doesn't exist
  form.addEventListener("submit" /** NOT CLICK!!! */, handleSubmit);
}
