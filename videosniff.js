/**
 * SenPlayer Video Sniff (Quantumult X only)
 * 捕获 m3u8 / mp4 并自动播放（覆盖当前播放）
 */

const url = $request.url || "";
const DEBUG = false;

// 仅处理视频流
if (!/\.(m3u8|mp4)(\?.*)?$/i.test(url)) {
  $done({});
}

// ===== SenPlayer 内部请求过滤 =====
const ua = ($request.headers["User-Agent"] || $request.headers["user-agent"] || "").toLowerCase();
if (ua.includes("senplayer")) {
  DEBUG && console.log("[videosniff] request from SenPlayer, skip notify");
  $done({});
}

// ===== 防重复（URL + 时间窗口）=====
const KEY_URL  = "senplayer_last_url";
const KEY_TIME = "senplayer_last_time";

const now = Date.now();
const lastUrl  = $prefs.valueForKey(KEY_URL) || "";
const lastTime = parseInt($prefs.valueForKey(KEY_TIME) || "0");

// URL 指纹，避免动态参数
const fp = url.slice(0, 80);
const lastFp = lastUrl.slice(0, 80);

// 8 秒内 + 同指纹 → 拦截
if (fp === lastFp && now - lastTime < 8000) {
  DEBUG && console.log("[videosniff] duplicate blocked");
  $done({});
}

// 记录状态
$prefs.setValueForKey(url, KEY_URL);
$prefs.setValueForKey(now.toString(), KEY_TIME);

// ===== SenPlayer 自动播放（强制切换） =====
const playUrl =
  "senplayer://x-callback-url/play?url=" +
  encodeURIComponent(url) +
  "&t=" + now +
  "&force=true";  // <-- 保证覆盖当前播放

// ===== 通知 =====
$notify(
  "🎬 SenPlayer 视频嗅探",
  "点击立即播放（自动切换）",
  url,
  { "open-url": playUrl }
);

DEBUG && console.log("[videosniff] play:", url);

$done({});