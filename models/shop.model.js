module.exports = (sequelize, Sequelize) => {
    const Shop = sequelize.define("shop", {
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
    },{
      timestamps: true,
      createdAt: "createTime",
      updatedAt: false,
    });

    return Shop;
};
