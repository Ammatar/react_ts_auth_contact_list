const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/database.sqlite3',
  logging: false,
});

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
const Contact = sequelize.define('Contact', {
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
});
User.hasMany(Contact);
Contact.belongsTo(User);
module.exports = { User, Contact, sequelize };
