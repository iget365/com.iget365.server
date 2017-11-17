import { Sequelize } from 'sequelize'
import { mysql } from '../config'

const sequelize = new Sequelize(mysql.database, mysql.username, mysql.password, {
  host: mysql.host,
  dialect: mysql.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

function defineModel (name, attributes, tableName) {
  let defaultAttrs = {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    }
  }

  // make fields ordered
  let attrs = {}

  attrs.id = defaultAttrs.id

  for (let attr in attributes) {
    attrs[attr] = attributes[attr]
  }

  return sequelize.define(name, attrs, {
    tableName: tableName || name,
    timestamps: true,
    paranoid: true,
    underscored: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    hooks: {
      beforeValidate: (resource, options) => {
        // perhaps to be used.
      }
    }
  })
}

export default {
  defineModel: defineModel,
  Sequelize: Sequelize,
  sync: () => {
    sequelize.sync({ force: true })
  }
}
