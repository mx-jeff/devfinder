const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const http = require('http')
const { setupSocket } = require('./socket')

const port = 3333
const app = express()
const server = http.Server(app)

setupSocket(server)

require('./database/data')

app.use(cors())
app.use(express.json())
app.use(routes)

server.listen(port)
console.log(`Servidor na porta ${port}`)