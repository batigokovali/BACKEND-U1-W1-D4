import Express from "express"
import multer from "multer"
import { extname } from "path"
import { saveBlogpostCovers, getBlogposts, writeBlogposts } from "../../lib/fs-tools.js"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const blogpostCoversRouter = Express.Router()

const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "U4-W1-D4/blogposts",
        },
    }),
}).single("cover")

blogpostCoversRouter.post("/:blogpostID/uploadCover/single", cloudinaryUploader, async (req, res, next) => {
    try {
        console.log("FILE:", req.file)
        // const blogpostsArray = await getBlogposts()
        // const index = blogpostsArray.findIndex(blogpost => blogpost.id === req.params.blogpostID)
        // const oldBlogpost = blogpostsArray[index]
        // const updatedBlogpost = { ...oldBlogpost, ...req.body, coverURL: `http://localhost:3001/img/blogposts/${fileName}`, updatedAt: new Date() }
        // blogpostsArray[index] = updatedBlogpost
        // await writeBlogposts(blogpostsArray)
        res.send({ message: "blogpost cover uploaded :D" })
    } catch (error) {
        next(error)
    }

})

export default blogpostCoversRouter