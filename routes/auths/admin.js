const router = require("express").Router();
const { body } = require("express-validator");
const authController = require("../../controller/auths/admin");
const Admin = require("../../model/admin");
const isAuth = require("../../middlewares/auths/is-authAdminCvShop");

router.post(
  "/admin/signup",
  isAuth,
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail({ gmail_remove_dots: false })
      .custom(async (value, { req }) => {
        const adminDoc = await Admin.findOne({ email: value });
        if (adminDoc) {
          return Promise.reject("E-Mail adress already exist!");
        }
      }),
    body("password").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post("/admin/login", authController.login);

module.exports = router;
