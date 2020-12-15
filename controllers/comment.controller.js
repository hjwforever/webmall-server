const db = require("../models");
const Comment = db.comments;
const Op = db.Sequelize.Op;

// 创建评论
// exports.createComment = (goodId, comment) => {
//   return Comment.create({
//     name: comment.name,
//     text: comment.text,
//     goodId: goodId,
//   })
//     .then((comment) => {
//       console.log(">> Created comment: " + JSON.stringify(comment, null, 4));
//       return comment;
//     })
//     .catch((err) => {
//       console.log(">> Error while creating comment: ", err);
//     });
// };

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: comments } = data;
  const currentPage = (page ? +page : 0) + 1;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, comments , totalPages, currentPage };
};

// 创建并保存一条评论
exports.create = (req, res) => {
  // 验证商品名字及价格有效
  if (!req.body.goodId || !req.body.name || !req.body.text) {
    res.status(400).send({
      message: "goodId, name or text can not be empty!"
    });
    return;
  }

  // 定义商品信息
  const comment = {
    name: req.body.name,
    text: req.body.text,
    goodId: req.body.goodId
  };

  // 创建商品
  Comment.create(comment)
    .then(data => {
      console.log(">> Created comment: " + JSON.stringify(comment, null, 4));
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the comment."
      });
    });
};

// 查找所有
exports.findAll = (req, res) => {
  const { size, name, page } = req.query;

  if (page<1){
    res.status(202).send({
      message: "No such page, page >= 1"
    });
    return ;
  }

  const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  const { limit, offset } = getPagination(page-1, size);

  Comment.findAndCountAll({ where: condition, limit, offset})
    .then(data => {
      const response = getPagingData(data, page-1, limit);
      // console.log(response);
      // res.send(data);
      if (response.comments.length === 0) {
        res.status(202).send({
          message: "No data or no such page"
        });
      }
      else res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving comments."
      });
    });
};

// 查找一个
exports.findOne = (req, res) => {
  const id = req.params.id;

  Comment.findByPk(id)
    .then(data => {
      if (!data){
        res.status(202).send({
          message: `No such comment with id = ${id}`
        });
      }
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Comment with id=" + id
      });
    });
};

// 更新一个
exports.update = (req, res) => {
  const id = req.params.id;

  Comment.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num === 1 || num[0] === 1) { // 更新成功
        res.send({
          message: "Comment was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Comment with id=${id}. Maybe Comment was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Comment with id=" + id
      });
    });
};

// 删除一个
exports.delete = (req, res) => {
  const id = req.params.id;

  Comment.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num === 1 || num[0] === 1) { // 删除成功
        res.send({
          message: "Comment was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Comment with id=${id}. Maybe Comment was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Comment with id=" + id
      });
    });
};

// 删除所有
exports.deleteAll = (req, res) => {
  Comment.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Comments were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all comments."
      });
    });
};
