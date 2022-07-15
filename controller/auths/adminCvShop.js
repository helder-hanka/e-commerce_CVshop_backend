const { validationResult } = require("express-validator");
const AdminCvShop = require("../../model/adminCvShop");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAdminCvShop = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array() });
  }
  if (!req.file) {
    return res.status(200).json({ message: "No image provided" });
  }
  const { email, password } = req.body;
  const userId = req.userId;
  const hashedPw = await bcrypt.hash(password, 12);

  const create = new AdminCvShop({
    email: email,
    password: hashedPw,
    image: req.file.path,
    adminCvShop: userId,
  });
  try {
    const result = await create.save();
    res.status(200).json({ message: "Created", adminCvShop: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const loginAdminCvShop = async (req, res, next) => {
  const { password, email } = req.body;
  let loadAdminCvShop;
  try {
    const adminShop = await AdminCvShop.findOne({ email: email });

    loadAdminCvShop = adminShop;

    if (!adminShop) {
      const error = new Error("A admin with email could not found.");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, adminShop.password);
    if (!isEqual) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw err;
    }

    const token = jwt.sign(
      { email: loadAdminCvShop.email, userId: loadAdminCvShop._id.toString() },
      "cvshop238adminCvshop",
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ token: token, userId: loadAdminCvShop._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  createAdminCvShop,
  loginAdminCvShop,
};
