module.exports = app => {
  const comments = require("../controllers/comment.controller");

  const router = require("express").Router();

  // 创建并保存商品信息
  router.post("/", comments.create);

  // 按条件查找所有商品信息
  router.get("/", comments.findAll);

  // 查找指定id的商品信息
  router.get("/:id", comments.findOne);

  // 更新指定id的商品信息
  router.put("/:id", comments.update);

  // 删除指定id的商品信息
  router.delete("/:id", comments.delete);

  // 删除所有商品信息
  router.delete("/", comments.deleteAll);

  app.use('/api/comments', router);
};
