import Express from "express";
import uniqid from "uniqid"
import createHttpError from "http-errors";
import authorsRouter from "../authors/index.js";
import { checkBlogpostsSchema, triggerBadRequest } from "./validation.js"
import { getBlogposts, writeBlogposts } from "../../lib/fs-tools.js";

const commentsRouter = Express.Router()

commentsRouter.post("/:blogpostID/comments", async (req, res, next) => {

})

export default commentsRouter