const router = require("express").Router();
const shop = require("../controller/user/shop");

router.get("/", shop.getProductAll);
router.get("/:name", shop.getProductByName);

module.exports = router;
