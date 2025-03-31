import express from "express"
const router = express.Router()
import {index, show, search, storeOrder} from "../controllers/coverControllers.js"


router.get("/", index)

router.get("/search", search)

router.get("/:slug", show)

router.post("/order", storeOrder)




export default router