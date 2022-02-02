import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload); // once you click it, it is disabled

  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({
    corePath: "/assets/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();

  ffmpeg.FS(
    "writeFile",
    files.input,
    await fetchFile(videoFile) /** Binary Data that we made */
  );

  await ffmpeg.run(
    "-i" /** input */,
    files.input,
    "-r",
    "60" /** "-r" and 60 makes encoding faster */,
    files.output
  );

  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  ); // creating thumbnail

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "imagle/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4"); // create Anchor for Video

  downloadFile(thumbUrl, "MyThumbnail.jpg"); // create Anchor for thumbnail

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
};

const downloadFile = (fileUrl, fileName) => {
  // create Anchor & thumbnail for video
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleStart = () => {
  //actionBtn.innerText = "Stop Recording";
  actionBtn.innerText = "recording";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleStart);
  //actionBtn.addEventListener("click", handleStop);

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
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  };

  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

const init = async () => {
  // get Stream
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 1024, height: 576 },
  });
  //console.log(stream);
  video.srcObject = stream;
  video.play();
};

init();

actionBtn.addEventListener("click", handleStart);
