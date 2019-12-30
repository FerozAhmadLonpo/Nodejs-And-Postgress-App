const Sequelize = require('sequelize');
module.exports = new Sequelize('codegig', 'postgres', 'superuser', {
  host: 'localhost',
  dialect: 'postgres',
  operatorAliases: false,
  pool: {
    max: 5,
    min: 0,
    aquuire: 30000,
    idle: 10000
  }
});