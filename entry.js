/**
 * @name slqhubentry
 * @desc 适配私有仓库qx重写脚本获取
 * @author axkrr
*/

const DEBUG = true;

// 页面级防抖
const PAGE_KEY = "slqhub_page_once";

if ($prefs.valueForKey(PAGE_KEY)) {
  DEBUG && console.log("[slqhub-entry] page already handled");
  $done({});
  return;
}

$prefs.setValueForKey("1", PAGE_KEY);

// 15秒后自动释放
setTimeout(() => {
  $prefs.removeValueForKey(PAGE_KEY);
}, 15000);

// 分发表
const MAP = [
  {
    name: "videosniff",
    test: /\.(m3u8|mp4)(\?.*)?$/i,
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

// 命中判断
const reqUrl = ($request && $request.url) || "";
DEBUG && console.log("[slqhub-entry] request:", reqUrl);

const hit = MAP.find(item => item.test.test(reqUrl));

if (!hit) {
  DEBUG && console.log("[slqhub-entry] no match");
  $done({});
  return;
}

// 脚本级防重复
const LOAD_KEY = `slqhub_loaded_${hit.name}`;

if ($prefs.valueForKey(LOAD_KEY)) {
  DEBUG && console.log("[slqhub-entry] already loaded:", hit.name);
  $done({});
  return;
}

$prefs.setValueForKey("1", LOAD_KEY);
DEBUG && console.log("[slqhub-entry] hit:", hit.name);

// 拉取并执行私有脚本
$httpClient.get(hit.url, (err, resp, data) => {
  if (err || !data) {
    console.log("[slqhub-entry] load failed:", hit.url);
    $done({});
    return;
  }

  try {
    eval(data);
  } catch (e) {
    console.log("[slqhub-entry] eval error:", e);
  }

  $done({});
});