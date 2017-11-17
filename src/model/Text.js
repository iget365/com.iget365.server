import db from './db'

const Sequelize = db.Sequelize

export const Text = db.defineModel('Text', {
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, 'text')
