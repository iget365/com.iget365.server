import { Session, User } from '../model'
import { auth, error } from '../common'
import { validation } from '../validation'

export const session = {
  async login (ctx) {
    const obj = {
      phone: ctx.request.body.phone,
      password: ctx.request.body.password
    }
    let errors = {}

    if (!validation.phone.test(obj.phone)) {
      errors.phone = 'invalid phone.'
    }

    if (!validation.required.test(obj.password)) {
      errors.password = 'invalid password.'
    }

    if (Object.keys(errors).length) {
      error.err422(ctx, errors)
      return
    }

    try {
      const user = await User.findOne({
        where: obj
      })

      if (!user) {
        error.err400(ctx, 'phone or password is not correct.')
        return
      }

      const userId = user.get('id')
      const token = auth.generateToken()
      let session = await Session.findOne({
        where: {
          userId
        }
      })

      if (session) {
        await session.update({
          token
        })
      } else {
        session = await Session.create({
          userId,
          token
        })
      }

      if (!session) {
        error.err400(ctx, 'create session failed.')
        return
      }

      ctx.body = session
    } catch (e) {
      console.error(e.message)
      error.err500(ctx)
    }
  },
  async logout (ctx) {
    const token = ctx.params.token

    if (!validation.required.test(token)) {
      error.err400(ctx, 'invalid token.')
      return
    }

    try {
      const existing = await Session.findOne({
        where: {
          token
        }
      })

      if (!existing) {
        error.err400(ctx, 'token is not existing.')
        return
      }

      existing.destroy()

      ctx.body = existing
    } catch (e) {
      console.error(e.message)
      error.err500(ctx)
    }
  },
  async getUser (ctx) {
    try {
      const user = await auth.getUser(ctx)

      if (user) {
        ctx.body = user
      }
    } catch (e) {
      console.error(e.message)
      error.err500(ctx)
    }
  }
}
