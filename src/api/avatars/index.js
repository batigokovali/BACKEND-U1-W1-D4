import Express from "express"
import multer from "multer"
import { extname } from "path"
import { saveAuthorsAvatars, getAuthors, writeAuthors } from "../../lib/fs-tools.js"


const authorAvatarsRouter = Express.Router()

authorAvatarsRouter.post("/:authorID/uploadAvatar", multer().single("avatar"), async (req, res, next) => {
    try {
        console.log("FILE:", req.file)
        console.log("BODY:", req.body)
        const originalFileExtension = extname(req.file.originalname)
        const fileName = req.params.authorID + originalFileExtension
        await saveAuthorsAvatars(fileName, req.file.buffer)

        const authorsArray = await getAuthors()
        const index = authorsArray.findIndex(author => author.id === req.params.authorID)
        const oldAuthor = authorsArray[index]
        const updatedAuthor = { ...oldAuthor, ...req.body, avatarURL: `http://localhost:3001/img/blogposts/${fileName}`, updatedAt: new Date() }
        authorsArray[index] = updatedAuthor
        await writeAuthors(authorsArray)
        res.send({ message: "avatar uploaded :D" })
    } catch (error) {
        next(error)
    }
})

export default authorAvatarsRouter