/*
脚本名称: 航旅纵横 - 净化脚本
功能: 1. 移除首页/行程页 Banner 2. 保持头像等正常资源显示
*/

let body = $response.body;
if (body) {
    try {
        let obj = JSON.parse(body);
        let url = $request.url;

        // 核心：处理广告网关接口
        if (url.indexOf("gateway/api/umetrip/advert") !== -1) {
            // 航旅的广告通常在 data 节点下，根据不同版本可能在不同层级
            if (obj.data) {
                // 清空 Banner 列表
                if (obj.data.bannerList) obj.data.bannerList = [];
                if (obj.data.ads) obj.data.ads = [];
                // 处理弹窗广告
                if (obj.data.popup) obj.data.popup = null;
            }
            // 部分版本在内容最外层
            if (obj.bannerList) obj.bannerList = [];
            
            body = JSON.stringify(obj);
        }
    } catch (e) {
        console.log("航旅纵横脚本解析失败");
    }
}
$done({ body });
