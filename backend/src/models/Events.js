const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const App = require('./app');

// const Event = sequelize.define('Event', {
//   event: { type: DataTypes.STRING, allowNull: false },
//   url: DataTypes.STRING,
//   referrer: DataTypes.STRING,
//   device: DataTypes.STRING,
//   ipAddress: { type: DataTypes.STRING, allowNull: false },
//   timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//   metadata: DataTypes.JSON,
//   userId: DataTypes.STRING,
// });

// Event.belongsTo(App);
// App.hasMany(Event);

// module.exports = Event;

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', { 
    event: { type: DataTypes.STRING, allowNull: false },
    url: DataTypes.STRING,
    referrer: DataTypes.STRING,
    device: DataTypes.STRING,
    ipAddress: { type: DataTypes.STRING, allowNull: false },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    metadata: DataTypes.JSON,
    userId: DataTypes.STRING,
  });   
  Event.associate = (models) => {
    Event.belongsTo(models.App);
  };
  return Event;
};