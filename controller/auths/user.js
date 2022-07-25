const { validationResult } = require("express-validator");
const User = require("../../model/user/user");
const bcrypt = require("bcrypt");

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

module.exports = {
  signup,
};
