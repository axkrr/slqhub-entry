/*********************************
 * SenPlayer Video Sniff (QX Final)
 *********************************/

const req = $request;
const resp = $response;

if (!req || !resp || !resp.body) {
  $done({});
}

const url = req.url;
const body = resp.body;

// 只处理主播放列表
if (!body.includes("#EXTM3U") || !body.includes("#EXT-X-STREAM-INF")) {
  $done({});
}

// ========= 去重 =========
const KEY = "senplayer_last_m3u8";
const last = $prefs.valueForKey(KEY) || "";

if (last === url) {
  $done({});
}

$prefs.setValueForKey(url, KEY);

// ========= 选最高码率 =========
let best = "";
let maxBw = 0;

const lines = body.split("\n");
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l.includes("BANDWIDTH=")) {
    const m = l.match(/BANDWIDTH=(\d+)/);
    const bw = m ? parseInt(m[1]) : 0;

    const next = lines[i + 1] || "";
    if (bw > maxBw && next && !next.startsWith("#")) {
      maxBw = bw;
      best = next.trim();
    }
  }
}

let finalUrl = url;
if (best) {
  if (best.startsWith("http")) {
    finalUrl = best;
  } else {
    const base = url.substring(0, url.lastIndexOf("/") + 1);
    finalUrl = base + best;
  }
}

// ========= 播放 =========
const now = Date.now();
const playUrl =
  "senplayer://x-callback-url/play?url=" +
  encodeURIComponent(finalUrl) +
  "&t=" +
  now;

$notification.post(
  "🎬 SenPlayer",
  "已切换至最高画质",
  finalUrl,
  { url: playUrl }
);

$done({});