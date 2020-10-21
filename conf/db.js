const env = process.env.NODE_ENV; // 环境信息

let MYSQL_CONF;
let REDIS_CONF;
if (env === "dev") {
  // mysql
  MYSQL_CONF = {
    host: "localhost", // 主机 本地可使用localhost
    user: "root", // 数据库用户名
    password: "root", // 数据库用户的密码
    port: "3306", // 数据库端口号，默认3306
    database: "myblog", // 需要连接的数据库
  };
  // redis
  REDIS_CONF = {
    host: "127.0.0.1",
    port: 6379,
  };
}

if (env === "production") {
  // mysql
  MYSQL_CONF = {
    host: "localhost", // 主机 本地可使用localhost
    user: "root", // 数据库用户名
    password: "root", // 数据库用户的密码
    port: "3306", // 数据库端口号，默认3306
    database: "myblog", // 需要连接的数据库
  };
  // redis
  REDIS_CONF = {
    host: "127.0.0.1",
    port: 6379,
  };
}
module.exports = { MYSQL_CONF, REDIS_CONF };
