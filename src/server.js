import Express from "Express" //added "type" : "module" to the JSON file
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./api/authors/index.js"
import blogpostsRouter from "./api/blogposts/index.js"
import cors from 'cors'
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notfoundHandler } from "./errorHandlers.js"

const server = Express()
const port = 3001

const sampleMiddleware = (req, res, next) => {
    console.log(`Request method ${req.method} -- url ${req.url} -- ${new Date()}`)
    next()
}

server.use(sampleMiddleware)
server.use(cors())
server.use(Express.json()) //added this to get rid of undefined bodies in request

server.use("/authors", authorsRouter)
server.use("/blogposts", blogpostsRouter)

server.use(badRequestHandler) // 400
server.use(unauthorizedHandler) // 401
server.use(notfoundHandler) // 404
server.use(genericErrorHandler) // 500

server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
})