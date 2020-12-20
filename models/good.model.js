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
        url: {
            type: Sequelize.STRING
        },
    },{
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTime'
    });

    return Good;
};
