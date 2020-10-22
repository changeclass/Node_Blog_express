const express = require("./like-express");

const app = express();
console.log(app);
app.use((req, res, next) => {
  console.log("请求开始", req.method);
  next();
});
app.use((req, res, next) => {
  // 假设处理Cookie
  req.cookie = {
    userId: "123",
  };
  next();
});
app.use((req, res, next) => {
  // 假设处理post data
  // 异步
  setTimeout(() => {
    req.body = {
      a: 100,
      b: 200,
    };
    next();
  });
});

app.use("/api", (req, res, next) => {
  console.log("处理/api 路由");
  next();
});
app.get("/api", (req, res, next) => {
  console.log("处理/api 路由");
  next();
});
app.post("/api", (req, res, next) => {
  console.log("处理/api 路由");
  next();
});

app.get("/api/get-cookie", (req, res, next) => {
  console.log("get /api/get-cookie");
  res.json({
    errno: 0,
    data: req.cookie,
  });
});

app.post("/api/get-post-data", (req, res, next) => {
  console.log("post /api/get-post-data");
  res.json({
    errno: 0,
    data: req.body,
  });
});

app.listen(3000, () => {
  console.log("server is running on http://127.0.0.1:3000");
});
