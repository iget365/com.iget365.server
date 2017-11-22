import fs from 'fs'
import https from 'https'
import Koa from 'koa'
import send from 'koa-send'
import router from './router'
import bodyParser from 'koa-bodyparser'
import { server } from './config'

const app = new Koa()
const callback = app.callback()
const options = {
  key: fs.readFileSync('./sslcerts/private.key', 'utf8'),
  cert: fs.readFileSync('./sslcerts/certificate.crt', 'utf8')
}

app.use(async function(ctx, next) {
  let pth = ctx.path

  if (pth.indexOf('.html') !== -1 || pth.indexOf('assets/') !== -1) {
    pth = pth.replace(/assets\//g, '')

    await send(ctx, pth, {root: server.servePath})
  } else {
    await next()
  }
})

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

https.createServer(options, callback).listen(server.port)

console.log(`https server started on port ${server.port}`)
