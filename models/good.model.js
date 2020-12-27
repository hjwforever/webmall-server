module.exports = (sequelize, Sequelize) => {
  const Good = sequelize.define("good", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.FLOAT
    },
    imgUrl: {
      type: Sequelize.STRING
    },
  },{
    timestamps: true,
    createdAt: false,
    updatedAt: 'updateTime'
  });

  return Good;
};
