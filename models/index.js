const dbConfig = require("../config/db/mysql.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,

  logging: false,
  timezone: '+08:00',

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },


  define: {
    timestamps: true,
    createdAt:'created_at',
    updatedAt:'updated_at',
    underscored: true
  },
  dialectOptions: {
    dateStrings: true,
    typeCast: true,

  }

});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 设置角色类型
db.ROLES = ["user", "admin"];
db.label = require("./label.model.js")(sequelize, Sequelize);

// 商铺和商品
db.shops = require("./shop.model.js")(sequelize, Sequelize);
db.goods = require("./good.model.js")(sequelize, Sequelize);

// 用户和角色
db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);

// 商品的评论和分类标签
db.comments = require("./comment.model.js")(sequelize, Sequelize);
db.tag = require("./tag.model.js")(sequelize, Sequelize);

// 图片
db.images = require("./image.model.js")(sequelize, Sequelize);

// 用户和角色 多对多关系
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

// 商铺和商品 一对多关系
db.shops.hasMany(db.goods, { as: "goods" });
db.goods.belongsTo(db.shops, {
  foreignKey: "shopId",
  as: "shop",
});

// 商品和评论 一对多关系
db.goods.hasMany(db.comments, { as: "comments" });
db.comments.belongsTo(db.goods, {
  foreignKey: "goodId",
  as: "good",
});

// 商品和分类标签 多对多关系
db.tag.belongsToMany(db.goods, {
  through: "good_tag",
  as: "goods",
  foreignKey: "tag_id",
});
db.goods.belongsToMany(db.tag, {
  through: "good_tag",
  as: "tags",
  foreignKey: "good_id",
});

// 商品和标签 多对多关系
db.label.belongsToMany(db.goods, {
  through: "good_label",
  // as: "goods",
  foreignKey: "label_id",
  otherKey: "good_id"
});
db.goods.belongsToMany(db.label, {
  through: "good_label",
  // as: "labels",
  foreignKey: "good_id",
  otherKey: "label_id"
});
module.exports = db;
