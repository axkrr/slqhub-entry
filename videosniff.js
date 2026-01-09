/**
 * SenPlayer Video Sniff (Quantumult X only)
 * 捕获 m3u8 / mp4 并强制切换播放
 * 不限制站点｜强防抖｜极简通知
 */

const url = $request.url || "";
const DEBUG = false;

/* ========= 仅处理视频流 ========= */
if (!/\.(m3u8|mp4)(\?.*)?$/i.test(url)) {
  $done({});
}

/* ========= SenPlayer 内部请求过滤 ========= */
const ua =
  ($request.headers["User-Agent"] ||
   $request.headers["user-agent"] ||
   "").toLowerCase();

if (ua.includes("senplayer")) {
  DEBUG && console.log("[videosniff] senplayer internal request");
  $done({});
}

/* ========= 强防重复（网页级 + 播放级）========= */
const KEY_FP   = "senplayer_fp";
const KEY_TIME = "senplayer_time";

const now = Date.now();

// URL 指纹（完全忽略参数）
const fp = url.split("?")[0];

// 读取历史
const lastFp   = $prefs.valueForKey(KEY_FP) || "";
const lastTime = parseInt($prefs.valueForKey(KEY_TIME) || "0");

// 同一视频 + 10 秒内 → 直接丢弃
if (fp === lastFp && now - lastTime < 10000) {
  DEBUG && console.log("[videosniff] duplicate blocked");
  $done({});
}

// 写入状态
$prefs.setValueForKey(fp, KEY_FP);
$prefs.setValueForKey(String(now), KEY_TIME);

/* ========= SenPlayer 强制播放 ========= */
const playUrl =
  "senplayer://x-callback-url/play" +
  "?url=" + encodeURIComponent(url) +
  "&t=" + now +
  "&force=true";

/* ========= 极简通知 ========= */
$notify(
  "🎬 SenPlayer",
  "",
  "获取视频流成功",
  { "open-url": playUrl }
);

DEBUG && console.log("[videosniff] play:", url);

$done({});