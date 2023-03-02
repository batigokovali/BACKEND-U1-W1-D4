import Express from "express";
import fs, { write } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid"
import createHttpError from "http-errors";
import authorsRouter from "../authors/index.js";
import { checkBlogpostsSchema, triggerBadRequest } from "./validation.js"

const blogpostsRouter = Express.Router()

const blogpostsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogposts.json")
const getBlogposts = () => JSON.parse(fs.readFileSync(blogpostsJSONPath))
const writeBlogposts = blogpostsArray => fs.writeFileSync(blogpostsJSONPath, JSON.stringify(blogpostsArray))

blogpostsRouter.post("/", checkBlogpostsSchema, triggerBadRequest, (req, res, next) => {
    const newBlogpost = { ...req.body, id: uniqid(), createdAt: new Date(), updatedAt: new Date() }
    const blogpostsArray = getBlogposts()
    blogpostsArray.push(newBlogpost)
    writeBlogposts(blogpostsArray)
    res.status(201).send({ id: newBlogpost.id })
})

blogpostsRouter.get("/", (req, res, next) => {
    const blogposts = getBlogposts()
    if (req.query && req.query.category) {
        const filteredBlogposts = blogposts.filter(blogpost => blogpost.category === req.query.category)
        res.send(filteredBlogposts)
    }
    res.send(blogposts)
})

blogpostsRouter.get("/:blogpostID", (req, res, next) => {
    try {
        const blogpostsArray = getBlogposts()
        const foundBlogpost = blogpostsArray.find(blogpost => blogpost.id = req.params.blogpostID)
        if (foundBlogpost) {
            res.send(foundBlogpost)
        } else {
            next(createHttpError(404, `Blogpost with id ${req.params.blogpostID} not found, try again!`))
        }
    } catch (error) {
        next(error)
    }
})

blogpostsRouter.put("/:blogpostID", (req, res, next) => {
    try {
        const blogpostsArray = getBlogposts()
        const index = blogpostsArray.findIndex(blogpost => blogpost.id === req.params.blogpostID)

        if (index !== -1) {
            const oldBlogpost = blogpostsArray[index]
            const updatedBlogpost = { ...oldBlogpost, ...req.body, updatedAt: new Date() }
            blogpostsArray[index] = updatedBlogpost
            writeBlogposts(blogpostsArray)
            res.send(updatedBlogpost)
        } else {
            next(createHttpError(404, `Blogpost with id ${req.params.blogpostID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

blogpostsRouter.delete("/:blogpostID", (req, res, next) => {
    try {
        const blogpostsArray = getBlogposts()
        const remainingBlogposts = blogpostsArray.filter(blogpost => blogpost.id !== req.params.blogpostID)

        if (blogpostsArray.length !== remainingBlogposts.length) {
            writeBlogposts(remainingBlogposts)
            res.status(204).send()
        } else {
            next(createHttpError(404, `Blogpost with id ${req.params.blogpostID} not found :D`))
        }
    } catch (error) {
        next(error)
    }
})

authorsRouter.get("/:authorID/blogposts", (req, res, next) => {
    try {
        const blogpostsArray = getBlogposts()
        const blogpostsWithAuthorsID = blogpostsArray.filter(blogpostWithID => blogpostWithID.author.id === req.params.authorID)
        res.send(blogpostsWithAuthorsID)
    } catch (error) {
        next(error)
    }
})

export default blogpostsRouter