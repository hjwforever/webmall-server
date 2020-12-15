const { authJwt } = require("../middlewares");
const users = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

  const router = require("express").Router();

  // 按条件查找所有用户信息
  router.get("/", users.findAll);

  // 查找指定id的用户信息
  router.get("/:id", users.findOne);

  // 更新指定id的用户信息
  router.put("/:id", users.update);

  // 删除指定id的用户信息
  router.delete("/:id", users.delete);

  // 删除所有用户信息
  router.delete("/", users.deleteAll);

  app.use('/api/users', router);


  // 获取用户权限对应的显示内容
  app.get("/api/user/all", users.allAccess);

  app.get("/api/user/user", [authJwt.verifyToken], users.userBoard);

  app.get("/api/user/admin", [authJwt.verifyToken, authJwt.isAdmin], users.adminBoard);
};
