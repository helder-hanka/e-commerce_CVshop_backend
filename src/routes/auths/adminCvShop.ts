import { Router } from "express";
import { body } from "express-validator";
import adminCvShop from "../../controller/auths/adminCvShop";
import isAuth from "../../middlewares/auths/is-authAdminCvShop";
import Admin from "../../model/admins/adminCvShop/admin";

const router = Router();

router.post(
  "/signup",
  isAuth,
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail({ gmail_remove_dots: false })
      .custom(async (value) => {
        const adCvShop = await Admin.findOne({ email: value });
        if (adCvShop) {
          return Promise.reject("E-mail already exist");
        }
      }),
    body("password").trim().not().isEmpty(),
  ],
  adminCvShop.signup
);

router.post("/login", adminCvShop.login);

export default router;
