module.exports = app => {
  const goods = require("../controllers/good.controller");

  const router = require("express").Router();

  // 创建并保存商品信息
  router.post("/", goods.create);

  // 按条件查找所有商品信息
  router.get("/", goods.findAll);

  // 查找指定id的商品信息
  router.get("/:id", goods.findOne);

  // 更新指定id的商品信息
  router.put("/:id", goods.update);

  // 删除指定id的商品信息
  router.delete("/:id", goods.delete);

  // 删除所有商品信息
  router.delete("/", goods.deleteAll);

  app.use('/api/goods', router);
};
