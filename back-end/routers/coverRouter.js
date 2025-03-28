import express from "express"
const router = express.Router()
import {index, show, storeOrder} from "../controllers/coverControllers.js"


router.get("/", index)

router.get("/:id", show)

router.post("/", storeOrder)


export default router