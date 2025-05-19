const https = require("https");
const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const ytdl = require("@distube/ytdl-core");
const app = express();
const server = https.createServer(
  {
    key: fs.readFileSync("./kozaku05.f5.si-key.pem"),
    cert: fs.readFileSync("./kozaku05.f5.si-crt.pem"),
  },
  app
);
app.use(express.static("./public"));
app.use(express.json());
app.post("/download", async (req, res) => {
  const url = req.body.url;
  const type = req.body.type;
  if (!url) return res.status(400).send();
  console.log(url);
  if (!ytdl.validateURL(url)) return res.status(400).send();
  try {
    if (type) {
      res.setHeader("Content-Disposition", "attachment; filename=video.mp3");
      const stream = ytdl(url, { quality: "highestaudio" });
      ffmpeg(stream)
        .noVideo()
        .audioBitrate(128)
        .format("mp3")
        .pipe(res, { end: true });
      return;
    }
    res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
    ytdl(url, {
      quality: "highest",
      filter: (format) =>
        format.container === "mp4" && format.codecs.includes("avc1"), // H.264のみ
    }).pipe(res);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});
app.post("/info", async (req, res) => {
  let url = req.body.url;
  if (!url) return res.status(400).send();
  if (!ytdl.validateURL(url)) return res.status(400).send();
  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const thumbnail =
      info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;
    const data = {
      title: title,
      thumbnail: thumbnail,
    };
    res.status(200).send(JSON.stringify(data));
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});
server.listen(3000);
