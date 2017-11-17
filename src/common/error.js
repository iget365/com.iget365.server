export const error = {
  err400 (ctx, msg) {
    const err = {
      code: 400,
      msg: msg || 'Bad Request'
    }

    ctx.status = 400
    ctx.body = err
  },
  err401 (ctx, msg) {
    const err = {
      code: 401,
      msg: msg || 'Unauthorized'
    }

    ctx.status = 401
    ctx.body = err
  },
  err422 (ctx, errors) {
    const err = {
      code: 422,
      msg: 'validation failed.',
      errors: errors
    }

    ctx.status = 422
    ctx.body = err
  },
  err500 (ctx) {
    ctx.status = 500
  }
}
