const router = require("express").Router();
const { body } = require("express-validator");
const adress = require("../controller/adminCvShop/adress");
const upload = require("../middlewares/multerAdminCvShopAdress");
const isAuth = require("../middlewares/auths/is-authAdminCvShop");

router.post(
  "/adress",
  isAuth,
  upload.single("image"),
  [
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
  ],
  adress.createAdress
);

router.get("/adress/:id", adress.getAdressById);

module.exports = router;
