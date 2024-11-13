import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import AdminCvShop from "../../model/admins/adminCvShop/admin";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_ADMIN_CVSHOP_KEY } from "../../env";

const adminCvShop = {
  signup: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array() });
    }

    const hashedPw = await bcrypt.hash(req.body.password, 12);
    const create = new AdminCvShop({
      ...req.body,
      adminCvShopId: req.userId,
      password: hashedPw,
    });

    try {
      await create.save();
      res.status(200).json({ message: "Created" });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    const { password, email } = req.body;

    try {
      const adminShop = await AdminCvShop.findOne({ email: email });

      if (!adminShop) {
        const error: any = new Error("A admin with email could not found.");
        error.statusCode = 401;
        throw error;
      }

      const isEqual = await bcrypt.compare(password, adminShop.password);
      if (!isEqual) {
        const error: any = new Error("Wrong password or email");
        error.statusCode = 401;
        throw error;
      }

      if (!SECRET_ADMIN_CVSHOP_KEY) {
        const error: any = new Error(
          "The secret key to sign the token is missing."
        );
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: adminShop?.email,
          userId: adminShop?._id?.toString(),
        },
        SECRET_ADMIN_CVSHOP_KEY,
        { expiresIn: "24h" }
      );

      res
        .status(200)
        .json({ token: token, userId: adminShop?._id?.toString() });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
};

export default adminCvShop;
