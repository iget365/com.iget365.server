import { User, Session } from '../model'
import { api } from '../config'
import { consts } from '../consts'
import { error } from '../common'

export const auth = {
  generateToken () {
    const random = Math.random().toString().replace('0.', '')

    return random
  },
  async getUserId (token) {
    try {
      const existing = await Session.findOne({
        where: {
          token
        }
      })

      if (!existing) {
        return consts.token.inexistent
      }

      const now = +new Date()
      const updatedAt = +new Date(existing.get('updatedAt'))

      if (api.tokenExpire + updatedAt < now) {
        return consts.token.timeout
      }

      // todo debug why not update
      await existing.updateAttributes({
        updatedAt: new Date()
      })

      return existing.get('userId')
    } catch (e) {
      console.error(e.message)

      return consts.token.unexcepted
    }
  },
  async getUser (ctx) {
    const token = ctx.headers['x-token']
    let userId = -1
    let user = null

    if (!token) {
      error.err401(ctx)
      return null
    }

    userId = await auth.getUserId(token)

    if (userId === consts.token.inexistent || userId === consts.token.timeout || userId === consts.token.unexcepted) {
      error.err401(ctx)
      return null
    }

    try {
      user = await User.findById(userId, {
        where: {
          deletedAt: null
        },
        attributes: ['id', 'name', 'avatar', 'phone']
      })

      if (!user) {
        error.err401(ctx)
        return null
      }

      return user
    } catch (e) {
      console.error(e.message)
      error.err500(ctx)
      return null
    }
  }
}
