module.exports = (sequelize, DataTypes) => {
  const Label = sequelize.define("label", {
    label: {
      type: DataTypes.STRING,
      default: "推荐"
    },
    color: {
      type: DataTypes.STRING,
      default: "positive"
    },
    bgColor: {
      type: DataTypes.STRING,
      default: "border: 1px solid #21BA45"
    },
    style: {
      type: DataTypes.STRING,
      default: "推荐"
    },
  });

  return Label;
};
