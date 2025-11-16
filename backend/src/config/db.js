// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'mysql',
//   logging: false,
//   pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
// });

// module.exports = sequelize;

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
  host: '127.0.0.1',  // ← ADD THIS
  port: 3306,         // ← ADD THIS
  dialectOptions: {
    connectTimeout: 10000,
  },
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
});

module.exports = sequelize;