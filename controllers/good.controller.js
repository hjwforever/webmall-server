const db = require("../models");
const Good = db.goods;
const Comment = db.comments;
const Op = db.Sequelize.Op;


const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: goods } = data;
  const currentPage = (page ? +page : 0) + 1;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, goods , totalPages, currentPage };
};

// 创建并保存一个商品信息
exports.create = (req, res) => {
  // 验证商品名字及价格有效
  if (!req.body.name || !req.body.price) {
    res.status(400).send({
      message: "Name or price can not be empty!"
    });
    return;
  }

  // 定义商品信息
  const good = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price > 0 ? req.body.price : 0,
    url: req.body.url ? req.body.shopId : "http://img.aruoxi.top/webmall/goods/mate40pro%2B.png",
    shopId: req.body.shopId
      // ? req.body.shopId : 0,
  };

  // 创建商品
  Good.create(good)
    .then(data => {
      console.log(">> Created good: " + JSON.stringify(good, null, 4));
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the good."
      });
    });
};

// 查找所有
exports.findAll = (req, res) => {
  const { size, name } = req.query;
  const page = req.query.page - 1;

  if (page<0){
    res.status(202).send({
      message: "No such page, page >= 1"
    });
    return ;
  }

  const condition = name ? { title: { [Op.like]: `%${name}%` } } : null;
  const { limit, offset } = getPagination(page, size);

  Good.findAndCountAll({ where: condition, limit, offset,include: ["comments"] })
    .then(data => {
      const response = getPagingData(data, page, limit);
      // console.log(response);
      // res.send(data);
      if (response.goods.length === 0) {
        res.status(202).send({
          message: "No data or no such page"
        });
      }
      else res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving goods."
      });
    });
};

// 查找一个
exports.findOne = (req, res) => {
  const id = req.params.id;

  Good.findByPk(id, {include: ["comments"] })
    .then(data => {
      if (!data){
        res.status(202).send({
          message: `No such good with id = ${id}`
        });
      }
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Good with id=" + id
      });
    });
};

// 更新一个
exports.update = (req, res) => {
  const id = req.params.id;

  Good.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num === 1 || num[0] === 1) { // 更新成功
        res.send({
          message: "Good was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Good with id=${id}. Maybe Good was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Good with id=" + id
      });
    });
};

// 删除一个
exports.delete = (req, res) => {
  const id = req.params.id;

  Good.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num === 1 || num[0] === 1) { // 删除成功
        res.send({
          message: "Good was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Good with id=${id}. Maybe Good was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Good with id=" + id
      });
    });
};

// 删除所有
exports.deleteAll = (req, res) => {
  Good.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Goods were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all goods."
      });
    });
};

// 创建评论
exports.createComment = (goodId, comment) => {
  return Comment.create({
    name: comment.name,
    text: comment.text,
    goodId: goodId,
  })
    .then((comment) => {
      console.log(">> Created comment: " + JSON.stringify(comment, null, 4));
      return comment;
    })
    .catch((err) => {
      console.log(">> Error while creating comment: ", err);
    });
};

exports.createGood = (good) => {
  return Good.create({
    name: good.name,
    description: good.description,
    price: good.price,
    shopId: good.shopId,
    url: good.url
      // ? good.shopId : 0,
  })
    .then((good) => {
      console.log(">> Created good: " + JSON.stringify(good, null, 4));
      return good;
    })
    .catch((err) => {
      console.log(">> Error while creating good: ", err);
    });
};

exports.findGoodById = (goodId) => {
  return Good.findByPk(goodId, { include: ["comments"] })
    .then((good) => {
      return good;
    })
    .catch((err) => {
      console.log(">> Error while finding good: ", err);
    });
};

exports.findCommentById = (id) => {
  return Comment.findByPk(id, { include: ["good"] })
    .then((comment) => {
      return comment;
    })
    .catch((err) => {
      console.log(">> Error while finding comment: ", err);
    });
};
