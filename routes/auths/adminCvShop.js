const router = require("express").Router();

const { body } = require("express-validator");
const createAdminCvShopController = require("../../controller/auths/adminCvShop");
const upload = require("../../middlewares/multerAdminCvShop");
const AdminCvShop = require("../../model/adminCvShop");
const clearImg = require("../../lib/clearImg");

router.post(
  "/admin_cv_shop/signup",
  upload.single("image"),
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail({ gmail_remove_dots: false })
      .custom(async (value, { req }) => {
        console.log("value", value);
        console.log("req", req.body.email);
        const image = req.file.path;
        const user = await AdminCvShop.findOne({ email: value });
        if (user) {
          clearImg(image);
          return Promise.reject("E-mail already exist");
        }
      }),
    body("password").trim().not().isEmpty(),
  ],

  createAdminCvShopController.createAdminCvShop
);

router.post(
  "/admin_cv_shop/login",
  createAdminCvShopController.loginAdminCvShop
);

module.exports = router;
