/*
 * @name qdpure
 * @desc 去哒广告净化
 * @author axkrr
*/

var body = $response.body;
var obj = JSON.parse(body);

console.log("qdpure-original: " + body);

obj.load = 0;
obj.bid = [];
obj.lns = 0;

if (obj.data && Array.isArray(obj.data)) {
    obj.data = obj.data.map(item => {
        item.id = ""; 
        item.value = "";
        return item;
    });
}

console.log("qdpure-modified: " + JSON.stringify(obj));

// 重新打包返回
body = JSON.stringify(obj);
$done({body});
