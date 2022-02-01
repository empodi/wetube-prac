const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

const handleStart = () => {};

const init = async () => {
  // get Stream
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 400, height: 300 },
  });
  //console.log(stream);
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
