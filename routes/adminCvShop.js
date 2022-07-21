const router = require("express").Router();
const { body } = require("express-validator");
const adress = require("../controller/adminCvShop/adress");
const upload = require("../middlewares/multerAdminCvShopAdress");
const isAuth = require("../middlewares/auths/is-authAdminCvShop");
const payment = require("../controller/adminCvShop/payments");
const paymentAdmin = require("../controller/adminCvShop/administration/paymentAdmin");
const Admin = require("../model/admin/admin");
const splitJoinId = require("../lib/splitJoinId");

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
    body("amount").trim().isInt(),
    body("permissions").trim().isBoolean(),
    body("comments").trim().isString().isLength({ min: 5 }),
    body("validatePaymentReceved").trim().isBoolean(),
    body("confirmPaymentGive").trim().isBoolean(),
  ],
  payment.createPayment
);

router.get("/payments-admin-cv-shop", isAuth, payment.getPayments);
router.get(
  "/payments-All-admin-cv-shop/:id",
  isAuth,
  payment.getPaymentsAllAdminById
);
router.get("/payment-admin-cv-shop/:id", isAuth, payment.getPaymentById);

// Admin
router.post(
  "/payment-admin",
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
    body("admin")
      .trim()
      .isString()
      .custom(async (value) => {
        if (!value) {
          return Promise.reject("The value is empty");
        }
        const result = await Admin.findById(value);
        if (!result) {
          const resultId = splitJoinId(value);
          return Promise.reject(`The ID: ${resultId}, does not exist`);
        }
      }),
    body("provider").trim().isString().isLength({ min: 3 }),
    body("account_no").trim().isInt(),
    body("amount").trim().isInt(),
    body("permissions").trim().isBoolean(),
    body("comments").trim().isString().isLength({ min: 5 }),
    body("validatePaymentReceved").trim().isBoolean(),
    body("confirmPaymentGive").trim().isBoolean(),
  ],
  paymentAdmin.createPayment
);
router.get("/payments-admin/:id", isAuth, paymentAdmin.getPaymentsAdminAllById);
router.get(
  "/payment-admin/:adminId/payment/:paymentId",
  isAuth,
  paymentAdmin.getPaymentById
);

module.exports = router;
