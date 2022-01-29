const video = document.querySelector("video");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const playBtn = document.getElementById("play");
const time = document.getElementById("time");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");

let timeoutId = null;
let mouseTimeoutId = null;
let currentVolume = 0.5;
video.volume = currentVolume;

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);

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

const handleLoadedMetaData = (event) => {
  totalTime.innerText = formatTime(video.duration);
  timeline.max = Math.floor(video.duration);
};
const handleTimeUpdate = (event) => {
  currentTime.innerText = formatTime(video.currentTime);
  timeline.value = video.currentTime;
};
const handleTimeline = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = () => {
  const isFullScreen = document.fullscreenElement;
  if (isFullScreen) {
    document.exitFullscreen();
    fullScreenBtn.innerText = "Full Screen";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.innerText = "Normal Screen";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  if (mouseTimeoutId) {
    clearTimeout(mouseTimeoutId);
    mouseTimeoutId = null;
  }
  videoControls.classList.add("showing");
  mouseTimeoutId = setTimeout(hideControls, 3000);
};
const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleClickPlay = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

const handleSpacebarPlay = (event) => {
  if (event.keyCode === 32) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimeline);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("click", handleClickPlay);
document.addEventListener("keyup", handleSpacebarPlay);
