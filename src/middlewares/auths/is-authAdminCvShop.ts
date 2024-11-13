import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    userId: string;
  }
}

export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    const error: any = new Error("Not authentification");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "cvshop238adminCvshop");
  } catch (err: any) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error: any = new Error("Not authentificated");
    error.statusCode = 500;
    throw error;
  }

  req.userId = (decodedToken as JwtPayload).userId;
  next();
};
