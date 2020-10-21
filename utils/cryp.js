const crypto = require("crypto");

// 密匙
const SECRET_KEY = "sadjilk@#112321";

// MD5加密
function md5(content) {
  let md5 = crypto.createHash("md5");
  return md5.update(content).digest("hex");
}

// 加密函数
function genPassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`;
  console.log(`传入字符：${password} 加密结果：${md5(str)}`);
  return md5(str);
}

module.exports = {
  genPassword,
  md5,
};
