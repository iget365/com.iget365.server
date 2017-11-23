import Router from 'koa-router'
import { user, session, resource } from '../controller'

const router = new Router({
  prefix: '/api'
})

// public
router.post('/public/users', async (ctx, next) => {
  await user.create(ctx)
})

router.get('/public/phones/:phone', async (ctx, next) => {
  await user.findPhone(ctx)
})

router.post('/public/sessions', async (ctx, next) => {
  await session.login(ctx)
})

router.del('/public/sessions/:token', async (ctx, next) => {
  await session.logout(ctx)
})

// links
router.get('/links', async (ctx, next) => {
  await resource.getList(ctx, 'link')
})
router.get('/links/:id', async (ctx, next) => {
  await resource.getById(ctx, 'link')
})
router.post('/links', async (ctx, next) => {
  await resource.post(ctx, 'link')
})
router.put('/links/:id', async (ctx, next) => {
  await resource.put(ctx, 'link')
})
router.patch('/links/:id', async (ctx, next) => {
  await resource.patch(ctx, 'link')
})
router.del('/links/:id', async (ctx, next) => {
  await resource.del(ctx, 'link')
})

// texts
router.get('/texts', async (ctx, next) => {
  await resource.getList(ctx, 'text')
})
router.get('/texts/:id', async (ctx, next) => {
  await resource.getById(ctx, 'text')
})
router.post('/texts', async (ctx, next) => {
  await resource.post(ctx, 'text')
})
router.put('/texts/:id', async (ctx, next) => {
  await resource.put(ctx, 'text')
})
router.patch('/texts/:id', async (ctx, next) => {
  await resource.patch(ctx, 'text')
})
router.del('/texts/:id', async (ctx, next) => {
  await resource.del(ctx, 'text')
})

// test
router.get('/hello', async (ctx, next) => {
  ctx.body = 'hello ++'
})

export default router
