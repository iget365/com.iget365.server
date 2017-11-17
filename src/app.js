import fs from 'fs'
import https from 'https'
import Koa from 'koa'
import serve from 'koa-static'
import router from './router'
import bodyParser from 'koa-bodyparser'
import { server } from './config'

const app = new Koa()
const callback = app.callback()
const options = {
  key: fs.readFileSync('./sslcerts/private.key', 'utf8'),
  cert: fs.readFileSync('./sslcerts/certificate.crt', 'utf8')
}

app.use(serve(server.servePath))
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

https.createServer(options, callback).listen(server.port)

console.log(`https server started on port ${server.port}`)
