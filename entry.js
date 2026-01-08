/**
 * slqhub-entry / entry.js
 * QX 多脚本统一入口（增强版 v2）
 */

const DEBUG = true; // true 打印日志，false 静默

/**
 * 分发规则表
 * name ：脚本标识
 * test ：URL 正则（支持 query 参数）
 * url ：私有仓库脚本地址
 */
const MAP = [
  {
    name: "dxstj",
    test: /dxstj|dianxin|telecom/i,
    url: "https://raw.githubusercontent.com/axkrr/slqhub/main/Surge/Module/JS/dxstj.js",
  },
  {
    name: "phpure",
    test: /pornhub|phncdn|phprcdn/i,
    url: "https://raw.githubusercontent.com/axkrr/slqhub/main/Surge/Module/JS/phpure.js",
  },
  {
    name: "qd",
    test: /api\.shanghailingye\.cn\/ad\/map.*/i, // 支持 query 参数
    url: "https://raw.githubusercontent.com/axkrr/slqhub/main/Surge/Module/JS/qd.js",
  },
  {
    name: "videosniff",
    test: /video|m3u8|mpd/i,
    url: "https://raw.githubusercontent.com/axkrr/slqhub/main/Surge/Module/JS/videosniff.js",
  },
];

// 当前请求 URL（task 场景可能为空）
const reqUrl = ($request && $request.url) || "";

// 打印请求 URL（调试用）
DEBUG && console.log("[slqhub-entry] request url:", reqUrl);

// 查找命中规则
const hit = MAP.find((m) => m.test.test(reqUrl));

if (!hit) {
  DEBUG && console.log("[slqhub-entry] no match for this URL");
  $done({});
} else {
  // 防止重复拉取同一个脚本
  const alreadyKey = `slqhub_loaded_${hit.name}`;
  if ($prefs.valueForKey(alreadyKey)) {
    DEBUG && console.log("[slqhub-entry] already loaded:", hit.name);
    $done({});
  } else {
    DEBUG && console.log(`[slqhub-entry] hit: ${hit.name} → ${hit.url}`);
    $prefs.setValueForKey("1", alreadyKey);

    // 运行期加载私有脚本（带 token）
    $httpClient.get(hit.url, (err, resp, data) => {
      if (err || !data) {
        console.log("[slqhub-entry] load failed:", hit.url);
        return $done({});
      }
      try {
        eval(data);
      } catch (e) {
        console.log("[slqhub-entry] eval error:\n" + e);
        $done({});
      }
    });
  }
}