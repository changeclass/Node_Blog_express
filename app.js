var createError = require("http-errors");
var express = require("express");
var path = require("path");
var fs = require("fs");
// 用于处理 Cookie
var cookieParser = require("cookie-parser");
// 记录 access log
var logger = require("morgan");

// 处理session的插件
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
// 引用路由
// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
// 自己的路由
var blogRouter = require("./routes/blog");
var userRouter = require("./routes/user");

// 实例化 express
var app = express();

// 视图模板
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

// 日志记录的级别
const ENV = process.env.NODE_ENV; // 当前运行的环境
if (ENV !== "production") {
  app.use(
    // 开发环境 测试环境
    logger("dev", {
      stream: process.stdout,
    })
  );
} else {
  const logFileName = path.join(__dirname, "logs", "access.log");
  const writeStream = fs.createWriteStream(logFileName, {
    flags: "a",
  });
  app.use(
    // 线上环境
    logger("combined", {
      stream: writeStream,
    })
  );
}

// 将数据转换为 JSON
app.use(express.json());
// 解析表单提交的数据
app.use(express.urlencoded({ extended: false }));
// Cookie
app.use(cookieParser());

const redisClient = require("./db/redis");
const sessionStroe = new RedisStore({
  client: redisClient,
});
// 处理session
app.use(
  session({
    secret: "asdjhkkask", // 加密的密匙
    cookie: {
      path: "/", // 默认配置-路径
      httpOnly: true, // 默认配置-不允许客户端修改
      maxAge: 24 * 60 * 60 * 1000, // 生效时间
    },
    store: sessionStroe,
  })
);

// 设置静态目录
// app.use(express.static(path.join(__dirname, "public")));

// 定义路由 // /(indexRouter里的路由)
// app.use("/", indexRouter);
// /users/(usersRouter里的路由)
// app.use("/users", usersRouter);
app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);

// 如果上面的路由无法匹配，则执行下面的路由 即404
app.use(function (req, res, next) {
  next(createError(404));
});

// 如果遇到错误
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
