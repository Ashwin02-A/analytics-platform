const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// const User = sequelize.define('User', {
//   googleId: { type: DataTypes.STRING, unique: true },
//   email: { type: DataTypes.STRING, unique: true, allowNull: false },
//   name: DataTypes.STRING,
// });

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define('User', {
//     googleId: { type: DataTypes.STRING, unique: true },
//     email: { type: DataTypes.STRING, unique: true, allowNull: false },
//     name: DataTypes.STRING,
//   });
//   return User;
// };

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    googleId: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: DataTypes.STRING,
  });

  User.associate = (models) => {
    User.hasMany(models.App);
  };

  return User;
};