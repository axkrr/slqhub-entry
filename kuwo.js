/**
 * @name kuwo
 * @desc kuwo maplocal固定返回
 * @author axkrr,𝐎𝐍𝐙𝟑𝐕
*/

const url = $request.url;

// 酷我maplocal固定返回
if (/mobilead\.kuwo\.cn\/EcomResourceServer\/(getIOSIsHideAd|getMotor)/.test(url)) {
    $done({body: '{}'});
} else if (/rich\.kuwo\.cn\/(AdService|ecom)\/kaiping\/ad[iI]nfo/.test(url)) {
    $done({body: '{}'});
} else if (/wapi\.kuwo\.cn\/openapi\/v1\/user\/adVip\/info/.test(url)) {
    $done({body: '{}'});
} else if (/wapi\.kuwo\.cn\/openapi\/v1\/operate(\/(adVip|freeMode\/h5))?\/text/.test(url)) {
    $done({body: '{}'});
} else if (/ad\.tencentmusic\.com\/config\/uni/.test(url)) {
    $done({body: ' '});
} else if (/abt-kuwo\.tencentmusic\.com\/kuwo\/ui\/info/.test(url)) {
    $done({body: '{}'});
} else {
    $done({}); // 默认空返回
}
