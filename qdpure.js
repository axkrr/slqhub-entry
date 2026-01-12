/*
脚本名称: 去哒 App 开屏去广告
脚本功能: 修改响应体，重置等待时间为0，清空广告队列
*/

var body = $response.body;
var obj = JSON.parse(body);

// 核心逻辑：修改数据
obj.load = 0;       // 将开屏等待时间 4000 改为 0
obj.bid = [];       // 清空广告位列表
obj.data = [];      // 清空可能存在的其他数据
obj.lns = 0;        // 尝试关闭某些逻辑开关 (可选)

// 重新打包返回
body = JSON.stringify(obj);
$done({body});
