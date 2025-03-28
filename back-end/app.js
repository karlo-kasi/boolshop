import express from "express"
import router from "./routers/coverRouter.js"
import setImagePath from "./middlewares/imagePath.js"
const app = express()
const port = 3000

app.use(express.static("public"))
app.use(express.json())
app.use(setImagePath)
app.use("/cover", router)

app.listen(port, () => {
    console.log(`Il server cover funziona sempre sulla port ${port}`)
})