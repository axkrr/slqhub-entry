/**
 * qdpure_admap_kill.js
 * Only for Quantumult X
 * Function: 清空 ad/map 返回的广告调度数据
 */

if (!$response || !$response.body) {
  $done({});
  return;
}

let body = $response.body;

try {
  let obj = JSON.parse(body);

  // 核心：清空广告调度
  if (Array.isArray(obj.bid)) obj.bid = [];
  if (Array.isArray(obj.data)) obj.data = [];

  // 保证 App 判定成功
  if ('code' in obj) obj.code = 1;
  if ('message' in obj) obj.message = 'success';

  $done({ body: JSON.stringify(obj) });
} catch (e) {
  // 非 JSON（或 SDK 异常返回），直接放行
  $done({});
}