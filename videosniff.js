/**
 * SenPlayer Video Sniff (Quantumult X only)
 * 捕获 m3u8 / mp4 并强制切换播放
 * 网页防抖 + SenPlayer 内防重复 + 极简通知
 */

const url = $request.url || "";
const DEBUG = false;

/* ========= 仅处理视频流 ========= */
if (!/\.(m3u8|mp4)(\?.*)?$/i.test(url)) {
  $done({});
}

/* ========= 网页级防抖 ========= */
const PAGE_KEY = "senplayer_page_once";
if ($prefs.valueForKey(PAGE_KEY)) {
  DEBUG && console.log("[videosniff] page already handled");
  $done({});
}
$prefs.setValueForKey("1", PAGE_KEY);
// 页面切换后 15 秒自动释放
setTimeout(() => {
  $prefs.removeValueForKey(PAGE_KEY);
}, 15000);

/* ========= SenPlayer 内部请求过滤 ========= */
const ua =
  ($request.headers["User-Agent"] ||
   $request.headers["user-agent"] ||
   "").toLowerCase();

if (ua.includes("senplayer")) {
  DEBUG && console.log("[videosniff] senplayer internal request");
  $done({});
}

/* ========= 视频去重 ========= */
const KEY_FP   = "senplayer_fp";
const KEY_TIME = "senplayer_time";

const now = Date.now();
const fp = url.split("?")[0];           // URL 指纹，忽略参数
const lastFp   = $prefs.valueForKey(KEY_FP) || "";
const lastTime = parseInt($prefs.valueForKey(KEY_TIME) || "0");

// 同一视频 + 8 秒内 → 不再通知
if (fp === lastFp && now - lastTime < 8000) {
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