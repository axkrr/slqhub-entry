/**
 * SenPlayer Video Sniff (Quantumult X only)
 * 指定站点嗅探 m3u8 / mp4 并强制切换播放
 */

const url = $request.url || "";
const DEBUG = false;

/* ========= 仅处理视频流 ========= */
if (!/\.(m3u8|mp4)(\?.*)?$/i.test(url)) {
  $done({});
}

/* ========= 站点白名单 ========= */
const allowHosts = [
  "pornhub.com",
  "txh067.com",
  "p3.unpljks.top"
];

const host = (() => {
  try { return new URL(url).hostname; } catch { return ""; }
})();

if (!allowHosts.some(d => host.includes(d))) {
  DEBUG && console.log("[videosniff] host not allowed:", host);
  $done({});
}

/* ========= SenPlayer 内部请求过滤 ========= */
const ua = (
  $request.headers["User-Agent"] ||
  $request.headers["user-agent"] ||
  ""
).toLowerCase();

if (ua.includes("senplayer")) {
  DEBUG && console.log("[videosniff] senplayer internal request");
  $done({});
}

/* ========= 防重复 ========= */
const KEY_URL  = "senplayer_last_url";
const KEY_TIME = "senplayer_last_time";

const now = Date.now();
const lastUrl  = $prefs.valueForKey(KEY_URL) || "";
const lastTime = parseInt($prefs.valueForKey(KEY_TIME) || "0");

// 指纹（忽略参数变化）
const fp     = url.split("?")[0];
const lastFp = lastUrl.split("?")[0];

// 8 秒内同资源不重复
if (fp === lastFp && now - lastTime < 8000) {
  DEBUG && console.log("[videosniff] duplicate blocked");
  $done({});
}

$prefs.setValueForKey(url, KEY_URL);
$prefs.setValueForKey(String(now), KEY_TIME);

/* ========= SenPlayer 强制播放 ========= */
const playUrl =
  "senplayer://x-callback-url/play?url=" +
  encodeURIComponent(url) +
  "&t=" + now +
  "&force=true";

/* ========= 通知美化 ========= */
const siteName =
  host.includes("pornhub") ? "Pornhub" :
  host.includes("txh067")  ? "TXH067"  :
  host.includes("unpljks") ? "UNPLJKS" :
  host;

const displayUrl = fp.length > 80 ? fp.slice(0, 77) + "…" : fp;

$notify(
  "🎬 SenPlayer 视频嗅探",
  `来源站点：${siteName}`,
  displayUrl,
  { "open-url": playUrl }
);

DEBUG && console.log("[videosniff] play:", url);

$done({});