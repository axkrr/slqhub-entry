/*
 * @name qdpure
 * @desc 去哒广告净化
 * @author axkrr
*/

var body = $response.body;
var obj = JSON.parse(body);

// 核心配置清空
obj.data = [];
obj.bid = [];

// 针对广告位逻辑的深度净化
obj.load = 0;
obj.lns = 0;
obj.code = 0; // 有些Appcode不为1就不渲染布局

// 如果响应中存在其他潜在的广告配置字段,一并处理
if (obj.extra) obj.extra = {};
if (obj.config) obj.config = {};

// 重新打包返回
body = JSON.stringify(obj);
$done({body});
