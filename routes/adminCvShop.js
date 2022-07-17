const router = require("express").Router();
const { body } = require("express-validator");
const adress = require("../controller/adminCvShop/adress");
const upload = require("../middlewares/multerAdminCvShopAdress");
const isAuth = require("../middlewares/auths/is-authAdminCvShop");
const payment = require("../controller/adminCvShop/payments");

router.post(
  "/adress",
  isAuth,
  upload.single("image"),
  [
    body("firstname", "Please enter a text end least 3 characters")
      .trim()
      .isString()
      .isLength({ min: 3 }),
    body("lastname", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("gender")
      .trim()
      .custom((value, { req }) => {
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
  adress.createAdress
);

router.get("/adress/:id", isAuth, adress.getAdressById);
router.put(
  "/adress/:id",
  isAuth,
  upload.single("image"),

  [
    body("firstname", "Please enter a text end least 3 characters")
      .trim()
      .isString()
      .isLength({ min: 3 }),
    body("lastname", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("gender")
      .trim()
      .custom((value, { req }) => {
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
  adress.updatedAdress
);

router.post(
  "/payment",
  isAuth,
  [
    body("payment_type")
      .trim()
      .isString()
      .custom((value, { req }) => {
        const paymentType = ["cash payment", "online payment"];
        const isValid = paymentType.some(
          (arr) => arr === req.body.payment_type.toLowerCase()
        );
        if (!isValid) {
          throw new Error(`Please use this type: ${paymentType}`);
        }
        return true;
      }),
    body("provider").trim().isString().isLength({ min: 3 }),
    body("account_no").trim().isInt(),
    body("permissions").trim().isBoolean(),
    body("comments").trim().isString().isLength({ min: 5 }),
    body("validatePaymentReceved").trim().isBoolean(),
    body("confirmPaymentGive").trim().isBoolean(),
  ],
  payment.createPayment
);

router.get("/payment", isAuth, payment.getPayments);

module.exports = router;
