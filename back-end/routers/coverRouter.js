import express from "express"
const router = express.Router()
import {index, show } from "../controllers/coverControllers.js"
import storeOrder from "../controllers/orderController.js"
import search from "../controllers/searchControllers.js"
import createPaymentSetting from "../controllers/paymentContoller.js"
import sendCoupon from "../controllers/coupons.js";

router.get("/", index);

router.get("/search", search);

router.get("/:slug", show);

router.post("/order", storeOrder);


router.post("/register", sendCoupon);

router.post("/payment", createPaymentSetting)




export default router;
