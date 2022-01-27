const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const time = document.getElementById("time");
const muteBtn = document.getElementById("mute");
const volume = document.getElementById("volume");

const handlePlayClick = (event) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};
const handlePause = (event) => (playBtn.innerText = "Play");
const handlePlay = (event) => (playBtn.innerText = "Pause");

const handleMute = (event) => {};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("mute", handleMute);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
