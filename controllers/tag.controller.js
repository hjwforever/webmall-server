const db = require("../models");
const Good = db.goods;
const Tag = db.tag;

exports.create = (tag) => {
  return Tag.create({
    name: tag.name,
  })
    .then((tag) => {
      console.log(">> Created Tag: " + JSON.stringify(tag, null, 2));
      return tag;
    })
    .catch((err) => {
      console.log(">> Error while creating Tag: ", err);
    });
};

exports.findAll = () => {
  return Tag.findAll({
    include: [
      {
        model: Good,
        as: "goods",
        attributes: ["id", "name", "description", "price"],
        through: {
          attributes: [],
        }
      },
    ],
  })
    .then((tags) => {
      return tags;
    })
    .catch((err) => {
      console.log(">> Error while retrieving Tags: ", err);
    });
};

exports.findById = (id) => {
  return Tag.findByPk(id, {
    include: [
      {
        model: Good,
        as: "goods",
        attributes: ["id", "name", "description", "price"],
        through: {
          attributes: [],
        }
      },
    ],
  })
    .then((tag) => {
      return tag;
    })
    .catch((err) => {
      console.log(">> Error while finding Tag: ", err);
    });
};

// 给商品添加标签
exports.addGood = (tagId, goodId) => {
  return Tag.findByPk(tagId)
    .then((tag) => {
      if (!tag) {
        console.log("Tag not found!");
        return null;
      }
      return Good.findByPk(goodId).then((good) => {
        if (!good) {
          console.log("Tutorial not found!");
          return null;
        }

        tag.addGood(good);
        console.log(`>> added Tutorial id=${good.id} to Tag id=${tag.id}`);
        return tag;
      });
    })
    .catch((err) => {
      console.log(">> Error while adding Tutorial to Tag: ", err);
    });
};
