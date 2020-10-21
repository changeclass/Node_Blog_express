const redis = require("redis");
const { REDIS_CONF } = require("../conf/db");

// 创建客户端 第一个参数表示端口 第二个参数表示地址
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);

// 如果发生错误
redisClient.on("err", (err) => {
  console.error(err);
});

module.exports = redisClient;
