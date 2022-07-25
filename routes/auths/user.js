const router = require("express").Router();
const User = require("../../model/user/user");
const { body } = require("express-validator");
const createUser = require("../../controller/auths/user");

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail({ gmail_remove_dots: false })
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("E-mail already exist");
        }
      }),
    body("password").trim().not().isEmpty(),
  ],
  createUser.signup
);

module.exports = router;
