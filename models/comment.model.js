module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("comment", {
    name: {
      type: DataTypes.STRING
    },
    text: {
      type: DataTypes.STRING
    }
  },{
    timestamps: true,
    createdAt: "createTime",
    updatedAt: 'updateTime'
  });

  return Comment;
};
