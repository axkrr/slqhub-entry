/**
 * @name qdpure_v3
 * @desc 去开屏广告,异常兜底
 */

if (typeof $response === 'undefined') {
  $done({});
  return;
}

let body = $response.body || '';
let headers = $response.headers || {};

// 预防缓存
delete headers['ETag'];
delete headers['Last-Modified'];
headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
headers['Pragma'] = 'no-cache';
headers['Expires'] = '0';

// 尝试解析 JSON
try {
  let obj = JSON.parse(body);

  if (obj && typeof obj === 'object') {
    // 开屏/首页广告常见字段
    const adKeys = [
      'data', 'list', 'ads', 'ad_list', 'items', 'banners',
      'advertisement', 'startPage', 'openAds'
    ];

    adKeys.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = Array.isArray(obj[key]) ? [] : {};
      }
    });

    // 强制返回成功状态
    if ('code' in obj) obj.code = 1;
    if ('status' in obj) obj.status = 1;
    if ('message' in obj) obj.message = 'success';
    if ('msg' in obj) obj.msg = 'success';

    $done({ body: JSON.stringify(obj), headers });
    return;
  }
} catch (e) {
  // 非 JSON 响应直接返回空或原 body（兜底）
  console.log('[qdpure_v3] parse fail, returning empty JSON for safety');
  $done({
    body: '{}',
    headers
  });
  return;
}

// 默认兜底
$done({ body, headers });