const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../../model/admin");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array() });
  }

  const email = req.body.email;
  const password = req.body.password;

  try {
    const hashedPw = bcrypt.hashSync(password, 12);

    const admin = new Admin({
      email: email,
      password: hashedPw,
    });

    const result = await admin.save();
    res.status(200).json({ message: "Admin created!", userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let loadAdmin;
  try {
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      const error = new Error("A admin with email could not found.");
      error.statusCode = 401;
      throw error;
    }
    loadAdmin = admin;
    const isEqual = await bcrypt.compare(password, admin.password);
    if (!isEqual) {
      const error = new Error("Wrong passeword!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadAdmin.email,
        userId: loadAdmin._id.toString(),
      },
      "cvshop238Admin",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: loadAdmin._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  signup,
  login,
};
