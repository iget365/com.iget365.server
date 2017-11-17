import db from './db'

const Sequelize = db.Sequelize

export const User = db.defineModel('User', {
  name: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: ''
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING(11),
    allowNull: false,
    unique: true
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: ''
  }
}, 'user')
