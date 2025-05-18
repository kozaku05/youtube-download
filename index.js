const rls = require("readline-sync");
const fs = require("fs");
const ytdl = require("@distube/ytdl-core");
const menus = "1.ダウンロード\n2.ダウンロードタイプの選択\nend.終了\n";

function menu() {
  console.log(menus);
  const input = rls.question("type-Number:");
  switch (input) {
    case "1":
      download();
      break;
    case "2":
      type();
      break;
    case "end":
      return;
    default:
      console.log("無効な選択肢です\n");
      menu();
      return;
  }
}
async function download() {
  let data = fs.readFileSync("./type.json", "utf8");
  data = JSON.parse(data);
  switch (data.type) {
    case "video":
      console.log("動画をダウンロードします");
      const url = rls.question("input-URL:");
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
    default:
      console.log("type.jsonエラー");
  }
}
function type() {
  console.log("後日実装予定\n");
  menu();
}
menu();
