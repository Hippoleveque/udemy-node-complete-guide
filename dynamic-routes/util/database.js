const Sequelize = require("sequelize");

const sequelize = new Sequelize("root", "node_udemy", "eragon123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
