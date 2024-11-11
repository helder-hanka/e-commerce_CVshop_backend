const router = require("express").Router();

const { body } = require("express-validator");
const createAdminCvShopController = require("../../controller/auths/adminCvShop");
const upload = require("../../middlewares/multer");
const AdminCvShop = require("../../model/adminCvShop/admin");
const clearImg = require("../../lib/clearImg");
const isAuth = require("../../middlewares/auths/is-authAdminCvShop");

router.post(
  "/signup",
  isAuth,
  upload.single("adminCvShopImg"),
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail({ gmail_remove_dots: false })
      .custom(async (value, { req }) => {
        if (!req.file) {
          return Promise.reject("No image provided");
        }
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

router.post("/login", createAdminCvShopController.loginAdminCvShop);

module.exports = router;
