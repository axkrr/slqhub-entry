/**
 * SenPlayer Video Sniff (Quantumult X)
 * 优化版：增强兼容性 + 防死锁
 */

const url = $request.url || "";
const ONCE_KEY = "senplayer_once";

// 1. 扩展匹配规则：增加对常见的 m3u8/mp4 特征的识别
const videoRegex = /\.(m3u8|mp4|mov|avi|flv)(\?.*)?$|playlist\.m3u8/i;

if (!videoRegex.test(url)) {
  $done({});
} else {
  // 2. 检查锁（放在正则匹配之后，减少干扰）
  if ($prefs.valueForKey(ONCE_KEY)) {
    console.log("🚫 SenPlayer: 已有弹窗，跳过检测: " + url);
    $done({});
  } else {
    // 3. 构造播放地址
    const playUrl = "senplayer://x-callback-url/play?url=" + encodeURIComponent(url) + "&force=true";

    // 4. 执行通知
    $notify(
      "🎬 SenPlayer",
      "发现视频流",
      "点击立即跳转播放",
      { "open-url": playUrl }
    );

    // 5. 通知成功后再加锁
    $prefs.setValueForKey("1", ONCE_KEY);
    console.log("✅ SenPlayer: 抓取成功并已上锁: " + url);

    // 10秒后释放，方便刷下一个视频
    setTimeout(() => {
      $prefs.removeValueForKey(ONCE_KEY);
      console.log("🔓 SenPlayer: 自动解锁");
    }, 10000);

    $done({});
  }
}
