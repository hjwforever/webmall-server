const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

exports.allAccess = (req, res) => {
    res.status(200).send("公共模块");
};

exports.userBoard = (req, res) => {
    res.status(200).send("文章模块");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("管理员模块");
};


const getPagination = (page, size) => {
  const limit = size ? +size : 6;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = (page ? +page : 0) + 1;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, users , totalPages, currentPage };
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

  const condition = name ? { title: { [Op.like]: `%${name}%` } } : null;
  const { limit, offset } = getPagination(page-1, size);

  User.findAndCountAll({ where: condition, limit, offset})
    .then(data => {
      const response = getPagingData(data, page-1, limit);
      // console.log(response);
      // res.send(data);
      if (response.users.length === 0) {
        res.status(202).send({
          message: "No data or no such page"
        });
      }
      else res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// 查找一个
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      if (!data){
        res.status(202).send({
          message: `No such user with id = ${id}`
        });
      }
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
};

// 更新一个
exports.update = (req, res) => {
  const id = req.params.id;
  const bcrypt = require("bcryptjs");

  req.body.password = bcrypt.hashSync(req.body.password, 8);
  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num === 1 || num[0] === 1) { // 更新成功
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// 删除一个
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num === 1 || num[0] === 1) { // 删除成功
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// 删除所有
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};
