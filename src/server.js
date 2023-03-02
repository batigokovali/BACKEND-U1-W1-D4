import Express from "Express" //added "type" : "module" to the JSON file
import { join } from "path"
import cors from 'cors'
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./api/authors/index.js"
import blogpostsRouter from "./api/blogposts/index.js"
import authorAvatarsRouter from "./api/avatars/index.js"
import blogpostCoversRouter from "./api/covers/index.js"
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notfoundHandler } from "./errorHandlers.js"


const server = Express()
const port = 3001
const publicFolderPath = join(process.cwd(), "./public")

//GLOBAL MIDDLEWARES
server.use(Express.static(publicFolderPath))
server.use(cors())
server.use(Express.json()) //added this to get rid of undefined bodies in request

//ENDPOINTS
server.use("/authors", authorsRouter)
server.use("/authors", authorAvatarsRouter)
server.use("/blogposts", blogpostsRouter)
server.use("/blogposts", blogpostCoversRouter)

//ERROR HANDLERS
server.use(badRequestHandler) // 400
server.use(unauthorizedHandler) // 401
server.use(notfoundHandler) // 404
server.use(genericErrorHandler) // 500

//ESSENTIALS
server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
})