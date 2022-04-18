const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  totalPrice: {
    type: Sequelize.DOUBLE,
    defaultValue: 0,
    allowNull: false
  }
})



module.exports = Order;
