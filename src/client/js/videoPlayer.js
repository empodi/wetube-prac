const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const time = document.getElementById("time");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");

let currentVolume = 0.5;
video.volume = currentVolume;

const handlePlayClick = (event) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};
const handlePause = (event) => (playBtn.innerText = "Play");
const handlePlay = (event) => (playBtn.innerText = "Pause");

const handleMute = (event) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : currentVolume;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  currentVolume = value;
  video.volume = value;
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
volumeRange.addEventListener("input", handleVolumeChange);
