/*
 * @name qdpure_v5_qx
 * @desc 去开屏广告
 */

if (typeof $response === 'undefined') {
  $done({});
  return;
}

let body = $response.body || '';
let headers = $response.headers || {};

// ===== 防缓存 =====
delete headers['ETag'];
delete headers['Last-Modified'];
headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
headers['Pragma'] = 'no-cache';
headers['Expires'] = '0';

// ===== 解析 JSON 广告接口 =====
try {
  let obj = JSON.parse(body);

  if (obj && typeof obj === 'object') {
    const adKeys = [
      'data', 'list', 'ads', 'ad_list', 'items', 'banners',
      'advertisement', 'startPage', 'openAds'
    ];

    adKeys.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = Array.isArray(obj[key]) ? [] : {};
      }
    });

    if ('code' in obj) obj.code = 1;
    if ('status' in obj) obj.status = 1;
    if ('message' in obj) obj.message = 'success';
    if ('msg' in obj) obj.msg = 'success';

    $done({ body: JSON.stringify(obj), headers });
    return;
  }
} catch (e) {
  console.log('[qdpure_v5_qx] parse fail, returning empty JSON for safety');
  $done({
    body: '{}',
    headers
  });
  return;
}

// ===== 拦截常见广告图片请求 =====
const adImagePatterns = [
  /p0\.meituan\.net\/bizad\//i,
  /static\.66mobi\.com\/creativeAudit\//i,
  /qudaapi\.8quan\.com\/index\/source\/show/i,
  /p66-ad\.adkwai\.com\//i,
  /adimg|ads|advert/i
];

if (adImagePatterns.some(pattern => pattern.test($request.url))) {
  // 返回空图片 body 防止白屏影响
  $done({
    body: '',
    headers
  });
  return;
}

// ===== 兜底返回原始 body =====
$done({ body, headers });