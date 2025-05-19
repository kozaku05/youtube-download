let isSending = false;
function sendReq() {
  if (isSending) return;
  isSending = true;
  const videoinfo = document.getElementById("videoinfo");
  videoinfo.innerHTML = "";
  videoinfo.innerHTML = "<h2>取得中...</h2>";
  const url = document.getElementById("url").value;
  if (!url) return;
  try {
    fetch("/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url }),
    }).then(async (res) => {
      if (!res.ok) return alert("情報の取得に失敗しました");
      res = await res.json();
      videoinfo.innerHTML = "";
      const title = res.title;
      const thumbnail = res.thumbnail;
      const h2 = document.createElement("h2");
      const img = document.createElement("img");
      h2.textContent = title;
      img.src = thumbnail;
      img.style.width = "80%";
      videoinfo.appendChild(h2);
      videoinfo.appendChild(img);
    });
    fetch("/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url }),
    }).then(async (res) => {
      if (!res.ok) return alert("ダウンロードに失敗しました");
      const blob = await res.blob();
      let filename = "video.mp4";
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      isSending = false;
    });
  } catch (e) {
    isSending = false;
    alert("エラー");
  }
}
