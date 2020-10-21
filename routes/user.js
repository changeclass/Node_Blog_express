var express = require("express");
const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

var router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const result = login(username, password);
  return result.then((data) => {
    if (data.username) {
      // 操作Session
      req.session.username = data.username;
      req.session.realName = data.realName;
      res.json(new SuccessModel("登陆成功"));
      return;
    } else {
      res.json(new ErrorModel("登陆失败"));
    }
  });
});

// router.get("/login-test", (req, res, next) => {
//   if (req.session.username) {
//     res.json({
//       errno: 0,
//       msg: "已登陆",
//     });
//   } else {
//     res.json({
//       errno: -1,
//       msg: "未成功",
//     });
//   }
// });
module.exports = router;
