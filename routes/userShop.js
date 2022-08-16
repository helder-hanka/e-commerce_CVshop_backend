const router = require("express").Router();
const shop = require("../controller/user/shop");

router.get("/", shop.getProductList);

module.exports = router;
