/**
 * slqhub-entry.js (FINAL)
 * QX 私有仓库统一入口 · 稳定终局版
 */

const DEBUG = true;
const ONCE_KEY = "slqhub_page_once";

// ========== 页面级防抖 ==========
if ($prefs.valueForKey(ONCE_KEY)) {
  DEBUG && console.log("[slqhub-entry] page already handled");
  $done({});
}
$prefs.setValueForKey("1", ONCE_KEY);

// 页面切换自动释放
setTimeout(() => {
  $prefs.removeValueForKey(ONCE_KEY);
}, 15000);

// ========== 分发表 ==========
const MAP = [
  {
    name: "videosniff",
    test: /\.(m3u8)(\?.*)?$/i,
    url: "https://raw.githubusercontent.com/axkrr/slqhub/main/QuantumultX/Rewrite/JS/videosniff.js",
  },
  {
    name: "dxstj",
    test: /dxstj|dianxin|telecom/i,
    url: "https://raw.githubusercontent.com/axkrr/slqhub/main/Surge/Module/JS/dxstj.js",
  },
  {
    name: "phpure",
    test: /pornhub|phncdn/i,
    url: "https://raw.githubusercontent.com/axkrr/slqhub/main/Surge/Module/JS/phpure.js",
  },
  {
    name: "qd",
    test: /api\.shanghailingye\.cn\/ad\/map/i,
    url: "https://raw.githubusercontent.com/axkrr/slqhub/main/Surge/Module/JS/qd.js",
  }
];

const reqUrl = ($request && $request.url) || "";
DEBUG && console.log("[slqhub-entry] url:", reqUrl);

const hit = MAP.find(m => m.test.test(reqUrl));
if (!hit) {
  DEBUG && console.log("[slqhub-entry] no match");
  $done({});
}

// ========== 脚本级防重复 ==========
const LOAD_KEY = `slqhub_loaded_${hit.name}`;
if ($prefs.valueForKey(LOAD_KEY)) {
  DEBUG && console.log("[slqhub-entry] already loaded:", hit.name);
  $done({});
}
$prefs.setValueForKey("1", LOAD_KEY);

DEBUG && console.log(`[slqhub-entry] hit: ${hit.name}`);

$httpClient.get(hit.url, (err, resp, data) => {
  if (err || !data) {
    console.log("[slqhub-entry] load failed:", hit.url);
    return $done({});
  }
  try {
    eval(data);
  } catch (e) {
    console.log("[slqhub-entry] eval error:", e);
  }
  $done({});
});