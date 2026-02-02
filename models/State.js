const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const State = sequelize.define(
  "State",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1
    },
    createAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updateAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    createBy: {
      type: DataTypes.INTEGER
    },
    updateBy: {
      type: DataTypes.INTEGER
    }
  },
  {
    tableName: "tb_state",
    timestamps: false,
    freezeTableName: true
  }
);

module.exports = State;
