const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../model/user/user");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const hashPass = await bcrypt.hash(password, 10);
    const user = new User({
      email: email,
      password: hashPass,
    });
    const result = await user.save();
    res.status(200).json({ message: "User created", useId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let loadUser;
  try {
    const admin = await User.findOne({ email: email });
    if (!admin) {
      const error = new Error("A User with email could not founf");
      error.statusCode = 401;
      throw error;
    }
    loadUser = admin;
    const isEqual = bcrypt.compare(admin.password, password);
    if (!isEqual) {
      const error = new Error("Wrong password or email");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { email: loadUser.email, userId: loadUser._id.toString() },
      "cvshop238user",
      { expiresIn: "24h" }
    );
    res.status(200).json({ token: token, userId: loadUser._id.toString() });
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
