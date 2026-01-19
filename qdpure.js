/*
 * @name qdpure
 * @desc 去哒广告净化
 * @author axkrr
*/

var body = $response.body;
var obj = JSON.parse(body);

// 保持成功状态码，防止启动卡死
obj.code = 1; 

// 保留数组格式，抹除具体的平台配置
if (Array.isArray(obj.data)) {
    obj.data = obj.data.map(item => ({
        ...item,
        "id": "",      // 清空广告位ID
        "value": ""    // 清空校验Token
    }));
}

// 其他辅助字段处理
obj.load = 0;
obj.bid = [];
obj.lns = 0;

// 重新打包返回
body = JSON.stringify(obj);
$done({body});
