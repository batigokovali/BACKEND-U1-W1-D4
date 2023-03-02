import Express from "express"
import multer from "multer"
import { extname } from "path"
import { saveBlogpostCovers, getBlogposts, writeBlogposts } from "../../lib/fs-tools.js"

const blogpostCoversRouter = Express.Router()

blogpostCoversRouter.post("/:blogpostID/uploadCover", multer().single("cover"), async (req, res, next) => {
    try {
        console.log("FILE:", req.file)
        console.log("BODY:", req.body)
        const originalFileExtension = extname(req.file.originalname)
        const fileName = req.params.blogpostID + originalFileExtension
        await saveBlogpostCovers(fileName, req.file.buffer)

        const blogpostsArray = await getBlogposts()
        const index = blogpostsArray.findIndex(blogpost => blogpost.id === req.params.blogpostID)
        const oldBlogpost = blogpostsArray[index]
        const updatedBlogpost = { ...oldBlogpost, ...req.body, coverURL: `http://localhost:3001/img/blogposts/${fileName}`, updatedAt: new Date() }
        blogpostsArray[index] = updatedBlogpost
        await writeBlogposts(blogpostsArray)
        res.send({ message: "blogpost cover uploaded :D" })
    } catch (error) {
        next(error)
    }
})

export default blogpostCoversRouter