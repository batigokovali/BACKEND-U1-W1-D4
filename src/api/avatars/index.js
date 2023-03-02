import Express from "express"
import multer from "multer"
import { extname } from "path"
import { saveAuthorsAvatars } from "../../lib/fs-tools.js"

const authorAvatarsRouter = Express.Router()

authorAvatarsRouter.post("/:authorID/uploadAvatar", multer().single("avatar"), async (req, res, next) => {
    try {
        console.log("FILE:", req.file)
        console.log("BODY:", req.body)
        const originalFileExtension = extname(req.file.originalname)
        const fileName = req.params.authorID + originalFileExtension
        await saveAuthorsAvatars(fileName, req.file.buffer)
        res.send({ message: "file uploaded :D" })
    } catch (error) {
        next(error)
    }
})

export default authorAvatarsRouter