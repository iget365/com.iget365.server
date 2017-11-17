import db from './db'

const Sequelize = db.Sequelize

export const Link = db.defineModel('Link', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, 'link')
