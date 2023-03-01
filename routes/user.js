const router = require("express").Router();
const shop = require("../controller/user/shop");
const { body } = require("express-validator");
const Adress = require("../controller/user/adress");
const uploadImageAdress = require("../middlewares/multer");
const isAuth = require("../middlewares/auths/is-authUser");

router.get("/shop", shop.getProductList);

router.post(
  "/adress",
  isAuth,
  uploadImageAdress.single("imageUserAdress"),
  [
    body("firstname", "Please enter a text end least 3 characters")
      .trim()
      .isString()
      .isLength({ min: 3 }),
    body("lastname", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("gender").custom((value, { req }) => {
      const gender = ["male", "female"];
      const isValid = gender.some(
        (arr) => arr === req.body.gender.toLowerCase()
      );
      if (!isValid) {
        throw new Error(`Please use this gender: ${gender}`);
      }
      return true;
    }),
    body("address_line_1", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ max: 50 })
      .isString(),
    body("address_line_2", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ max: 50 })
      .isString(),
    body("city", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("postal_code", "Please enter a number").trim().isInt(),
    body("country", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("telephone", "Please enter a number").trim().isInt(),
    body("mobile", "Please enter a number").trim().isInt(),
  ],
  Adress.createAdress
);

router.post("/order", isAuth, shop.postOrder);
router.get("/order", isAuth, shop.getOrders);

router.post("/orderInProgress", isAuth, shop.postOrderInProgress);
router.get("/orderInProgress", isAuth, shop.getOrderInProgress);
router.put(
  "/validateOrder/:id?",
  isAuth,
  [
    body("validate", "This validation must be a bolean!")
      .trim()
      .isBoolean()
      .custom((value, { req }) => {
        const validated = ["true"];
        const isValid = validated.some(
          (arr) => arr === req.body.validate.toString()
        );
        if (!isValid) {
          throw new Error(`Please use this validation ${validated}`);
        }
        return true;
      }),
  ],
  shop.validateOrder
);

module.exports = router;
