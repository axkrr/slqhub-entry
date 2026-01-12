/*
脚本名称: 大学搜题酱净化
功能: 1. 屏蔽首页弹窗 2. 移除开屏广告策略 & 计时
*/

let body = $response.body;
if (body) {
    let obj = JSON.parse(body);
    let url = $request.url;

    // 修改初始化配置
    if (url.indexOf("init/config/init") !== -1) {
        if (obj.data) {
            // 移除开屏广告配置
            if (obj.data.screen_ad) delete obj.data.screen_ad;
            if (obj.data.splash) delete obj.data.splash;
            // 尝试下发空配置
            obj.data.is_show_ad = false; 
            obj.data.ad_config = [];
        }
    }

    // 处理首页弹窗
    if (url.indexOf("init/config/popupconfig") !== -1) {
        if (obj.data) {
            obj.data.popupList = []; // 清空弹窗
            if (obj.data.vipSales) obj.data.vipSales.needShow = false;
        }
    }

    $done({ body: JSON.stringify(obj) });
} else {
    $done({});
}
