import db from './db'

const Sequelize = db.Sequelize

export const Session = db.defineModel('Session', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, 'session')
