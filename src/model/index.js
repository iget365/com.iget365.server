import db from './db'
import { User } from './User'
import { Link } from './Link'
import { Text } from './Text'
import { UserLink } from './UserLink'
import { UserText } from './UserText'
export { Session } from './Session'

User.belongsToMany(Link, { as: 'Link', through: UserLink, foreignKey: 'userId', otherKey: 'linkId' })
Link.belongsToMany(User, { as: 'User', through: UserLink, foreignKey: 'linkId', otherKey: 'userId' })

User.belongsToMany(Text, { as: 'Text', through: UserText, foreignKey: 'userId', otherKey: 'textId' })
Text.belongsToMany(User, { as: 'User', through: UserText, foreignKey: 'textId', otherKey: 'userId' })

export {
  db,
  User,
  Link,
  Text
}
