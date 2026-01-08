// QX 公有入口，仅负责拉私有逻辑

const CORE_URL =
  "https://raw.githubusercontent.com/你的用户名/你的私有仓库/main/core.js";

$httpClient.get(CORE_URL, (err, resp, data) => {
  if (err) {
    console.log("load private core failed");
    return $done({});
  }
  try {
    eval(data);
  } catch (e) {
    console.log("eval error: " + e);
  }
  $done({});
});