/**
 * @name SenPlayerVideoSniff
 * @desc 获取网页视频流跳转SenPlayer播放
 * @author axkrr,御清弦
*/

const url = $request.url || "";
const ONCE_KEY = "senplayer_once";
const videoRegex = /\.(m3u8|mp4|mov|avi|flv)(\?.*)?$|playlist\.m3u8/i;

if (videoRegex.test(url)) {
  const lastTime = $prefs.valueForKey(ONCE_KEY);
  const now = Date.now();

  // --- 逻辑判断 ---
  // 如果 20 秒内已经弹过窗，则跳过
  if (lastTime && (now - parseInt(lastTime) < 20000)) {
    console.log("🚫 SenPlayer: 冷却中，跳过检测");
    $done({});
  } else {
    // 满足条件：要么没锁，要么锁已经过期（超过20秒）
    const playUrl = "senplayer://x-callback-url/play?url=" + encodeURIComponent(url) + "&force=true";

    $notify("🎬 SenPlayer", "发现视频流", "点击跳转播放", { "open-url": playUrl });

    // 存入当前时间戳作为“锁”
    $prefs.setValueForKey(now.toString(), ONCE_KEY);
    console.log("✅ SenPlayer: 抓取成功，设置时间戳: " + now);

    $done({});
  }
} else {
  $done({});
}
