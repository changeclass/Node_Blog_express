const http = require("http");
const slice = Array.prototype.slice;

class LikeExpress {
  constructor() {
    // 存放中间件的列表
    this.routes = {
      all: [], // app.use(...)
      get: [], // app.get(...)
      post: [], // app.post(...)
    };
  }
  register(path) {
    const info = {};
    if (typeof path === "string") {
      // 第一个参数是路由时
      info.path = path;
      // 第二个参数开始，转为数据存入stack
      info.stack = slice.call(arguments, 1);
    } else {
      // 第一个参数是函数
      info.path = "/";
      // 第一个参数开始，转为数据存入stack
      info.stack = slice.call(arguments, 0);
    }
    return info;
  }

  use() {
    const info = this.register.apply(this, arguments);
    this.routes.all.push(info);
  }

  get() {
    const info = this.register.apply(this, arguments);
    this.routes.get.push(info);
  }

  post() {
    const info = this.register.apply(this, arguments);
    this.routes.post.push(info);
  }
  // 匹配符合规则的中间件
  match(method, url) {
    let stack = [];
    if (url === "/favicon.ico") {
      return stack;
    }
    // 获取routes
    let curRoutes = [];
    // 通过app.use注册中间件
    curRoutes = curRoutes.concat(this.routes.all);
    // 通过请求方法注册中间件
    curRoutes = curRoutes.concat(this.routes[method]);

    // 判断当前url是否符合根路径
    curRoutes.forEach((routeInfo) => {
      /**
       *  url==='/api/get-cookie' 且 routeInfo.path = '/'
       *  url==='/api/get-cookie' 且 routeInfo.path = '/api'
       *  url==='/api/get-cookie' 且 routeInfo.path = '/api/get-cookie'
       */
      if (url.indexOf(routeInfo.path) === 0) {
        stack = stack.concat(routeInfo.stack);
      }
    });
    return stack;
  }
  // 核心的next机制
  handle(req, res, stack) {
    const next = () => {
      // 拿到第一个匹配的中间件
      const middleware = stack.shift();
      if (middleware) {
        // 执行中间件函数
        middleware(req, res, next);
      }
    };
    next();
  }
  callback() {
    return (req, res) => {
      // 定义res.json方法
      res.json = (data) => {
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify(data));
      };
      const url = req.url;
      const method = req.method.toLowerCase();
      const resultList = this.match(method, url);
      //调用下一个 函数
      this.handle(req, res, resultList);
    };
  }
  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }
}

module.exports = () => {
  return new LikeExpress();
};
