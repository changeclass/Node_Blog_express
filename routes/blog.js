const {
  getList,
  getDetail,
  newBlog,
  updataBlog,
  delBlog,
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");
var express = require("express");
const { redisClient } = require("../db/redis");
var router = express.Router();
const loginCheck = require("../middleware/loginCheck");

// 获取列表路由
router.get("/list", (req, res, next) => {
  let author = req.query.author || "";
  const keyword = req.query.keyword || "";

  if (req.query.isAdmin) {
    if (req.session.username == null) {
      res.json(new ErrorModel("未登录"));
    }
    return;
  }
  // 强制查询自己的博客
  author = req.session.username;
  const result = getList(author, keyword);
  return result.then((listData) => {
    res.json(new SuccessModel(listData));
  });
});
// 获取详情路由
router.get("/detail", function (req, res, next) {
  const result = getDetail(req.query.id);
  return result.then((data) => {
    res.json(new SuccessModel(data));
  });
});
// 新建
router.post("/new", loginCheck, (req, res, next) => {
  req.body.author = req.session.username;
  const result = newBlog(req.body);
  return result.then((data) => {
    res.json(new SuccessModel(data));
  });
});
// 更新
router.post("/update", loginCheck, (req, res, next) => {
  const result = updataBlog(req.query.id, req.body);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel(val));
    } else {
      res.json(new ErrorModel("更新博客失败"));
    }
  });
});
// 删除
router.post("/del", loginCheck, (req, res, next) => {
  const author = req.session.username;
  const result = delBlog(req.query.id, author);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel("删除失败"));
    }
  });
});
module.exports = router;
