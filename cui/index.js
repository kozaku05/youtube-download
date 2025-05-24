const rls = require("readline-sync");
const fs = require("fs");
const ytdl = require("@distube/ytdl-core");
const menus = "1.動画ダウンロード(mp4)\n2.音声ダウンロード(mp3)\nend.終了\n";
function menu() {
  console.log(menus);
  const input = rls.question("type-Number:");
  switch (input) {
    case "1":
      mp4();
      break;
    case "2":
      mp3();
      break;
    case "end":
      return;
    default:
      console.log("無効な選択肢です\n");
      menu();
      return;
  }
}
async function mp4() {
  console.log("動画をダウンロードします");
  const url = rls.question("cancel=c\ninput-URL:");
  if (url === "c") return menu();
  if (!ytdl.validateURL(url)) {
    console.log("無効なURLです。\n");
    menu();
    return;
  }
  const info = await ytdl.getInfo(url);
  let title = info.player_response.videoDetails.title;
  console.log(title);
  title = title.replace(/[\\/:*?"<>|]/g, "_").trim();
  console.log("ダウンロードを開始します...");
  const stream = ytdl(url, { quality: "highest" });
  stream.pipe(fs.createWriteStream(title + ".mp4"));
  stream.on("error", (error) => {
    console.log(error);
    console.log("ダウンロードに失敗しました");
    return;
  });
  stream.on("finish", () => {
    console.log("ダウンロードに成功しました\n");
    menu();
  });
  return;
}
async function mp3() {
  console.log("音声をダウンロードします");
  const url2 = rls.question("cancel=c\ninput-URL:");
  if (url2 === "c") return menu();
  if (!ytdl.validateURL(url2)) {
    console.log("無効なURLです。\n");
    menu();
    return;
  }
  const info2 = await ytdl.getInfo(url2);
  let title2 = info2.player_response.videoDetails.title;
  console.log(title2);
  title2 = title2.replace(/[\\/:*?"<>|]/g, "_").trim();
  console.log("ダウンロードを開始します...");
  const stream2 = ytdl(url2, { quality: "highestaudio" });
  stream2.pipe(fs.createWriteStream(title2 + ".mp3"));
  stream2.on("error", (error) => {
    console.log(error);
    console.log("ダウンロードに失敗しました");
    return;
  });
  stream2.on("finish", () => {
    console.log("ダウンロードに成功しました\n");
    menu();
  });
}
menu();
