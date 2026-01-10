/**
 * @name qdpure_v5_qx
 * @desc 去开屏广告（仅 JSON 接口，防白屏）
 */

if (typeof $response === 'undefined') {
  $done({});
  return;
}

const url = $request.url;
let body = $response.body || '';
let headers = $response.headers || {};

// 禁用缓存，避免广告复活
delete headers['ETag'];
delete headers['Last-Modified'];
headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
headers['Pragma'] = 'no-cache';
headers['Expires'] = '0';

// 仅当 Content-Type 看起来像 JSON 才处理
const ct = (headers['Content-Type'] || headers['content-type'] || '').toLowerCase();
if (!ct.includes('json') && !body.trim().startsWith('{')) {
  // 非 JSON（图片 / 二进制 / html）直接放行
  $done({ body, headers });
  return;
}

let obj;
try {
  obj = JSON.parse(body);
} catch (e) {
  console.log('[qdpure_v5_qx] JSON parse fail, skip:', url);
  // 解析失败也直接放行，避免白屏
  $done({ body, headers });
  return;
}

// 常见广告字段清理
const adKeys = [
  'data',
  'list',
  'ads',
  'ad_list',
  'items',
  'banners',
  'advertisement',
  'startPage',
  'openAds',
  'splash',
  'launchAd'
];

adKeys.forEach(key => {
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    obj[key] = Array.isArray(obj[key]) ? [] : {};
  }
});

// 状态兜底，防止 App 判失败重试
if ('code' in obj) obj.code = 1;
if ('status' in obj) obj.status = 1;
if ('message' in obj) obj.message = 'success';
if ('msg' in obj) obj.msg = 'success';

$done({
  body: JSON.stringify(obj),
  headers
});