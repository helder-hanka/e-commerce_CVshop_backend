const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
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
    res.status(200).json({ message: "Admin created!", adminId: result._id });
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
