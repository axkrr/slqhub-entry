/**
 * SenPlayer Video Sniff (Quantumult X only)
 * 只通知一次，点击后强制播放
 */

const url = $request.url || "";

/* 只处理视频 */
if (!/\.(m3u8|mp4)(\?.*)?$/i.test(url)) {
  $done({});
}

/* ===== 页面级 once 防抖（核心）===== */
const ONCE_KEY = "senplayer_once";

if ($prefs.valueForKey(ONCE_KEY)) {
  // 已经通知过，后面全部丢弃
  $done({});
}

// 立刻上锁（非常关键）
$prefs.setValueForKey("1", ONCE_KEY);

// 15 秒后自动释放（页面切换够用）
setTimeout(() => {
  $prefs.removeValueForKey(ONCE_KEY);
}, 15000);

/* ===== SenPlayer 播放 ===== */
const playUrl =
  "senplayer://x-callback-url/play" +
  "?url=" + encodeURIComponent(url) +
  "&t=" + Date.now() +
  "&force=true";

/* ===== 极简通知 ===== */
$notify(
  "🎬 SenPlayer",
  "",
  "获取视频流成功",
  { "open-url": playUrl }
);

$done({});