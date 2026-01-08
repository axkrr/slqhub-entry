// QX 公有入口，仅负责拉私有逻辑

const CORE_URL =
  "https://raw.githubusercontent.com/axkrr/slqhub/main/QuantumultX/Rewrite/JS/core.js";

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