/**
 * slqhub-entry / entry.js
 * QX 多脚本统一入口（增强版）
 */

const DEBUG = true;

/**
 * 分发规则表
 * test：命中条件（URL 正则）
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
    test: /api\.shanghailingye\.cn\/ad\/map/i,
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

// 查找命中规则
const hit = MAP.find((m) => m.test.test(reqUrl));

// 未命中直接放行
if (!hit) {
  DEBUG && console.log("[slqhub-entry] no match");
  $done({});
  return;
}

DEBUG &&
  console.log(
    `[slqhub-entry] hit: ${hit.name}\n${hit.url}`
  );

// 运行期拉取私有脚本（会自动加 Authorization）
$httpClient.get(hit.url, (err, resp, data) => {
  if (err || !data) {
    console.log("[slqhub-entry] load failed");
    return $done({});
  }
  try {
    eval(data);
  } catch (e) {
    console.log("[slqhub-entry] eval error\n" + e);
    $done({});
  }
});