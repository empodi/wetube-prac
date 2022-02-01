import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({
    corePath: "/assets/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();

  ffmpeg.FS(
    "writeFile",
    "recording.webm",
    await fetchFile(videoFile) /** Binary Data that we made */
  );

  await ffmpeg.run(
    "-i" /** input */,
    "recording.webm",
    "-r",
    "60" /** "-r" and 60 makes encoding faster */,
    "output.mp4"
  );

  const mp4File = ffmpeg.FS("readFile", "output.mp4");

  console.log(mp4File);
  console.log(mp4File.buffer);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });

  const mp4Url = URL.createObjectURL(mp4Blob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click();
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    console.log(event.data);
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.width = 400;
    video.height = 300;
    video.play();
  };

  recorder.start();
};

const init = async () => {
  // get Stream
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 400, height: 300 },
  });
  //console.log(stream);
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
