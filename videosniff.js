/*********************************
 * SenPlayer Video Sniff (QX Only)
 * 1. 嗅探 m3u8 / mp4
 * 2. 自动播放（覆盖当前播放）
 * 3. 防重复通知
 *********************************/

const url = $request?.url || "";
if (!url) $done({});

// ========= 基础过滤 =========
if (!/\.m3u8|\.mp4/i.test(url)) {
  $done({});
}

// ========= 防抖 / 去重 =========
const NOW = Date.now();
const KEY_TIME = "senplayer_last_time";
const KEY_URL  = "senplayer_last_url";

const lastTime = parseInt($prefs.valueForKey(KEY_TIME) || "0");
const lastUrl  = $prefs.valueForKey(KEY_URL) || "";

// URL 指纹，避免动态参数导致误判
const fp = url.slice(0, 80);
const lastFp = lastUrl.slice(0, 80);

// 8 秒内 + 同指纹 → 拦截
if (fp === lastFp && NOW - lastTime < 8000) {
  $done({});
}

// ========= m3u8 最高码率解析 =========
let finalUrl = url;
const body = $response?.body || "";

if (/\.m3u8/i.test(url) && body.includes("#EXT-X-STREAM-INF")) {
  let maxBw = 0;
  let best = "";

  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.includes("BANDWIDTH=")) {
      const m = l.match(/BANDWIDTH=(\d+)/);
      const bw = m ? parseInt(m[1]) : 0;

      let next = "";
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j] && !lines[j].startsWith("#")) {
          next = lines[j].trim();
          break;
        }
      }

      if (bw > maxBw && next) {
        maxBw = bw;
        best = next;
      }
    }
  }

  if (best) {
    if (best.startsWith("http")) {
      finalUrl = best;
    } else if (best.startsWith("/")) {
      const origin = url.match(/^https?:\/\/[^\/]+/)[0];
      finalUrl = origin + best;
    } else {
      const base = url.substring(0, url.lastIndexOf("/") + 1);
      finalUrl = base + best;
    }
  }
}

// ========= 记录状态 =========
$prefs.setValueForKey(NOW.toString(), KEY_TIME);
$prefs.setValueForKey(finalUrl, KEY_URL);

// ========= 跳转 SenPlayer 并自动播放 =========
const encoded = encodeURIComponent(finalUrl);

// t 参数强制 SenPlayer 识别为新播放任务
const playUrl = `senplayer://x-callback-url/play?url=${encoded}&t=${NOW}`;

$notification.post(
  "🎬 SenPlayer 播放",
  "点击立即播放（自动切换）",
  finalUrl,
  { url: playUrl }
);

$done({});