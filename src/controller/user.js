import { User } from '../model'
import { client } from '../config'
import { error } from '../common'
import { validation } from '../validation'

export const user = {
  async create (ctx) {
    const obj = {
      name: ctx.request.body.name,
      phone: ctx.request.body.phone,
      password: ctx.request.body.password,
      avatar: ctx.request.body.avatar || client.avatarPath
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
      const existing = await User.findOne({
        where: {
          phone: obj.phone
        }
      })

      if (existing) {
        error.err400(ctx, 'phone already exists.')
        return
      }

      const instance = await User.create(obj)

      if (!instance) {
        error.err400(ctx, 'create user failed.')
        return
      }

      ctx.body = instance
    } catch (e) {
      console.error(e.message)
      error.err500(ctx)
    }
  },
  async findPhone (ctx) {
    const phone = ctx.params.phone

    if (!validation.phone.test(phone)) {
      error.err400(ctx, 'invalid phone.')
      return
    }

    try {
      const existing = await User.findOne({
        where: {
          phone
        },
        attributes: ['id', 'name', 'phone', 'avatar']
      })

      ctx.body = existing || {}
    } catch (e) {
      console.error(e.message)
      error.err500(ctx)
    }
  }
}
