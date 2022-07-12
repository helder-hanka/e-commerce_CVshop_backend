const router = require("express").Router();

const { body } = require("express-validator");
const createAdminCvShopController = require("../../controller/auths/adminCvShop");
const upload = require("../../middlewares/multerAdminCvShop");
const AdminCvShop = require("../../model/adminCvShop");
const clearImg = require("../../lib/clearImg");

router.post(
  "/admin_cv_shop",
  upload.single("image"),
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail()
      .custom(async (value, { req }) => {
        const image = req.file.path;
        console.log("req router", req.file.path);
        const user = await AdminCvShop.findOne({ email: value });
        if (user) {
          console.log("IMAGE", image);
          clearImg(image);
          return Promise.reject("E-mail already exist");
        }
      }),
    body("password").trim().not().isEmpty(),
  ],

  createAdminCvShopController.createAdminCvShop
);

module.exports = router;
