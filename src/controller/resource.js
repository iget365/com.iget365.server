import { model } from '../config'
import { consts } from '../consts'
import { validation } from '../validation'
import { auth, error } from '../common'
import * as models from '../model'

function validate (reqPathId, reqBody, resourceConfig, action) {
  const validations = resourceConfig.validation
  let attrs = {}
  let errors = {}

  if (action === consts.action.getById || action === consts.action.put || action === consts.action.patch || action === consts.action.del) {
    if (!validation.number.test(reqPathId)) {
      errors['path-id'] = 'invalid path id.'
    }
  }

  if (action === consts.action.post || action === consts.action.put) {
    for (let name in validations) {
      const val = reqBody[name]

      if (val === undefined || val === null || !validation[validations[name].test].test(val)) {
        errors[name] = validations[name].msg
      } else {
        attrs[name] = val
      }
    }
  }

  if (action === consts.action.patch) {
    for (let name in reqBody) {
      if (validations[name]) {
        const val = reqBody[name]

        if (val === undefined || val === null || !validation[validations[name].test].test(val)) {
          errors[name] = validations[name].msg
        } else {
          attrs[name] = val
        }
      }
    }
  }

  return {
    errors,
    attrs
  }
}

async function getContextAndValidate (ctx, type, action) {
  const reqPathId = ctx.params.id
  const reqBody = ctx.request.body
  const resourceConfig = model[type]
  const { errors, attrs } = validate(reqPathId, reqBody, resourceConfig, action)
  let returned = false
  let user = await auth.getUser(ctx)

  if (!user) {
    returned = true
  }

  if (Object.keys(errors).length) {
    error.err422(ctx, errors)
    returned = true
  }

  return {
    user,
    reqPathId,
    attrs,
    resourceConfig,
    returned
  }
}

async function update (ctx, type, action) {
  const { user, reqPathId, attrs, resourceConfig, returned } = await getContextAndValidate(ctx, type, action)

  if (!returned) {
    try {
      const list = await user['get' + resourceConfig.as]({
        where: {
          id: reqPathId
        },
        joinTableAttributes: []
      })
      const existing = list.length && list[0]

      if (!existing) {
        error.err400(ctx, 'resource is not existing.')
        return
      }

      await existing.update(attrs)
      // todo catch fail

      ctx.body = existing
    } catch (e) {
      console.error(e.message)
      error.err500(ctx)
    }
  }
}

export const resource = {
  async getList (ctx, type) {
    const { user, resourceConfig, returned } = await getContextAndValidate(ctx, type, consts.action.getList)

    if (!returned) {
      let offset = ctx.headers['x-offset']
      let limit = ctx.headers['x-limit']

      if (offset === undefined || offset === null || !validation.number.test(offset)) {
        offset = 0
      }

      if (limit === undefined || limit === null || !validation.number.test(limit) || limit > resourceConfig.limit) {
        limit = resourceConfig.limit
      }

      offset = +offset
      limit = +limit

      try {
        const list = await user['get' + resourceConfig.as]({
          offset,
          limit,
          order: [
            ['createdAt', 'DESC']
          ],
          joinTableAttributes: []
        })

        ctx.body = list
      } catch (e) {
        console.error(e.message)
        error.err500(ctx)
      }
    }
  },
  async getById (ctx, type) {
    const { user, reqPathId, resourceConfig, returned } = await getContextAndValidate(ctx, type, consts.action.getById)

    if (!returned) {
      try {
        const list = await user['get' + resourceConfig.as]({
          where: {
            id: reqPathId
          },
          joinTableAttributes: []
        })
        const existing = list.length && list[0]

        if (!existing) {
          error.err400(ctx, 'resource is not existing.')
          return
        }

        ctx.body = existing
      } catch (e) {
        console.error(e.message)
        error.err500(ctx)
      }
    }
  },
  async post (ctx, type) {
    const { user, attrs, resourceConfig, returned } = await getContextAndValidate(ctx, type, consts.action.post)

    if (!returned) {
      try {
        const created = await models[resourceConfig.model].create(attrs)

        if (!created) {
          error.err400(ctx, 'create resource failed.')
          return
        }

        await user['add' + resourceConfig.as](created)
        // await user['set' + resourceConfig.as](created)
        // vs
        // await created['addUser'](user)
        // await created['setUser'](user)

        ctx.body = created
      } catch (e) {
        console.error(e.message)
        error.err500(ctx)
      }
    }
  },
  async put (ctx, type) {
    await update(ctx, type, consts.action.put)
  },
  async patch (ctx, type) {
    await update(ctx, type, consts.action.patch)
  },
  async del (ctx, type) {
    const { user, reqPathId, resourceConfig, returned } = await getContextAndValidate(ctx, type, consts.action.del)

    if (!returned) {
      try {
        const list = await user['get' + resourceConfig.as]({
          where: {
            id: reqPathId
          },
          joinTableAttributes: []
        })
        const existing = list.length && list[0]

        if (!existing) {
          error.err400(ctx, 'resource is not existing.')
          return
        }

        const removedRows = await user['remove' + resourceConfig.as](existing)

        if (removedRows === 0) {
          error.err400(ctx, 'remove resource failed.')
          return
        }

        ctx.body = existing
      } catch (e) {
        console.error(e.message)
        error.err500(ctx)
      }
    }
  }
}
