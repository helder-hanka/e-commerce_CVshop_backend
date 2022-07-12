const { validationResult } = require("express-validator");
const AdminCvShop = require("../../model/adminCvShop");

const createAdminCvShop = async (req, res, next) => {
  const image = req.file.path;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array() });
  }
  if (!req.file) {
    return res.status(200).json({ message: "No image provided" });
  }
  const { email, password } = req.body;
  const userId = "62ccf4381abde8c3fdae1982";

  const create = new AdminCvShop({
    email: email,
    password: password,
    image: image,
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

module.exports = {
  createAdminCvShop,
};
