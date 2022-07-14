const router = require("express").Router();
const { body } = require("express-validator");
const authController = require("../../controller/auths/admin");
const Admin = require("../../model/admin");

router.post(
  "/admin/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const adminDoc = await Admin.findOne({ email: value });
        if (adminDoc) {
          return Promise.reject("E-Mail adress already exist!");
        }
      })
      .normalizeEmail(),
    body("password").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post("/admin/login", authController.login);

module.exports = router;
