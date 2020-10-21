const {
  getList,
  getDetail,
  newBlog,
  updataBlog,
  delBlog,
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");
var express = require("express");
var router = express.Router();

router.get("/list", (req, res, next) => {
  let author = req.query.author || "";
  const keyword = req.query.keyword || "";

  // if (req.query.isadmin) {
  //   // 管理员验证
  //   const loginCheckRult = loginCheck(req);
  //   if (loginCheckRult) {
  //     // 未登陆
  //     return loginCheckRult;
  //   }
  //   // 强行查询自己的博客
  //   author = req.session.username;
  // }
  const result = getList(author, keyword);
  return result.then((listData) => {
    res.json(new SuccessModel(listData));
  });
});

module.exports = router;
