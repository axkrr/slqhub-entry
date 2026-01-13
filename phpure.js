/**
 * @name phpure
 * @desc PornHub净化
 * @author ddgksf2013,axkrr
*/

// 只有当存在响应体时才处理
if (typeof $response !== "undefined" && $response.body) {
    let body = $response.body;
    
    // 检查是否为HTML内容
    if (body.includes('<head>')) {
        const cssLink = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ddgksf2013/Html/pornhub.css" type="text/css">';
        // 注入CSS链接
        body = body.replace(/<head>/, `<head>${cssLink}`);
        $done({ body });
    } else {
        // 若不是HTML直接原样返回
        $done({ body });
    }
} else {
    // 若没有body直接结束
    $done({});
}
