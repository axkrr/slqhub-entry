/**
 * @name kkavpure
 * @desc 屏蔽弹窗和轮播广告接口
 * @author axkrr
*/

let body = $response.body;

try {
    let obj = JSON.parse(body);
    // 强制关闭显示开关
    obj.show = 0;
    // 置空加密数据，防止本地解密逻辑继续执行
    obj.data = {
        "key": "",
        "data": ""
    };
    // 标注已被屏蔽
    obj.msg = "AdBlocked";
    
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    // 发生异常时直接原样返回，不影响APP正常加载
    $done({ body });
}
