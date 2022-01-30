const video = document.querySelector("video");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");

const time = document.getElementById("time");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");

const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");

video.play();

let controlsTimeout = null;
let controlsMoveTimeout = null;
let currentVolume = 0.5;
let isPlaying = true;
let isMouseOnControls = false;
video.volume = currentVolume;

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);

const hideControls = () => videoControls.classList.remove("showing");
const showControls = () => videoControls.classList.add("showing");

const setPlayPause = () => {
  if (video.paused) {
    video.play();
    isPlaying = true;
    playBtnIcon.classList = "fas fa-pause";
    //setTimeout(hideControls, 3000);
  } else {
    video.pause();
    isPlaying = false;
    playBtnIcon.classList = "fas fa-play";
    showControls();
  }
};

const handlePlayBtnClick = (event) => {
  setPlayPause();
};

const handleClickPlay = () => {
  setPlayPause();
};

const handleSpacebarPlay = (event) => {
  if (event.keyCode === 32) {
    setPlayPause();
  }
};

const handleMute = (event) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : currentVolume;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
  }
  currentVolume = value;
  video.volume = value;
  muteBtnIcon.classList =
    value == 0 ? "fas fa-volume-mute" : "fas fa-volume-up";
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
    fullScreenIcon.classList = "fas fa-expand";
    video.classList.remove("fullScreen");
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
    video.classList.add("fullScreen");
  }
};

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMoveTimeout) {
    clearTimeout(controlsMoveTimeout);
    controlsMoveTimeout = null;
  }
  showControls();
  if (isPlaying && !isMouseOnControls) {
    controlsMoveTimeout = setTimeout(hideControls, 3000);
  }
};

const handleMouseLeave = () => {
  if (isPlaying && !isMouseOnControls) {
    controlsTimeout = setTimeout(hideControls, 3000);
  }
};

const handleMouseControlsIn = () => {
  isMouseOnControls = true;
};
const handleMouseControlsOut = () => {
  isMouseOnControls = false;
};

playBtn.addEventListener("click", handlePlayBtnClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);

video.addEventListener("loadeddata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimeline);
fullScreenBtn.addEventListener("click", handleFullScreen);

video.addEventListener("click", handleClickPlay);
document.addEventListener("keyup", handleSpacebarPlay);

videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
videoControls.addEventListener("mouseenter", handleMouseControlsIn);
videoControls.addEventListener("mouseleave", handleMouseControlsOut);
