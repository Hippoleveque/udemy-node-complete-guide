const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Cart = sequelize.define("cart", {
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



module.exports = Cart;
