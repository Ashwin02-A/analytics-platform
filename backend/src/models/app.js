const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

// const App = sequelize.define('App', {
//   name: { type: DataTypes.STRING, allowNull: false },
//   apiKey: { type: DataTypes.TEXT, unique: true },
//   revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
//   expiresAt: DataTypes.DATE,
// });

// App.belongsTo(User);
// User.hasMany(App);


// module.exports = App;

module.exports = (sequelize, DataTypes) => {
  const App = sequelize.define('App', {
    name: { type: DataTypes.STRING, allowNull: false },
    apiKey: { type: DataTypes.TEXT, unique: true },
    revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
    expiresAt: DataTypes.DATE,
  });
  App.associate = (models) => {
    App.belongsTo(models.User);
    App.hasMany(models.Event);
  };
  return App;
};