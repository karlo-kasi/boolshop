import express from "express"
const router = express.Router()
import {index, show, search} from "../controllers/coverControllers.js"
import storeOrder from "../controllers/orderController.js"


router.get("/", index)

router.get("/search", search)

router.get("/:slug", show)

router.post("/order", storeOrder)




export default router