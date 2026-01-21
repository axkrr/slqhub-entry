/*
AnyThink/TopOn & Lingye Ad Block Script
*/

const url = $request.url;
let obj = JSON.parse($response.body || '{}');

// 处理TopOn广告位配置请求
if (url.indexOf('open/placement') !== -1) {
    obj.data = {};
    obj.msg = "Success";
    obj.code = 0;
}

// 处理TopOn实时竞价请求
if (url.indexOf('/bid') !== -1) {
    obj.data = [];
    obj.msg = "success";
    obj.code = 0;
}

// 处理领野广告Map请求
if (url.indexOf('ad/map') !== -1) {
    obj.data = [];
    obj.bid = [];
    obj.code = 1;
    obj.message = "成功";
}

$done({ body: JSON.stringify(obj) });
