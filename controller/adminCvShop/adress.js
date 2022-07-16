const { validationResult } = require("express-validator");
const Adress = require("../../model/adminCvShop/adress");
const clearImg = require("../../lib/clearImg");

const createAdress = async (req, res, next) => {
  const userId = req.userId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(422).json({ message: "No image provided" });
  }
  const {
    firstname,
    lastname,
    gender,
    address_line_1,
    address_line_2,
    city,
    postal_code,
    country,
    telephone,
    mobile,
  } = req.body;

  const creatAdress = new Adress({
    firstname: firstname,
    lastname: lastname,
    gender: gender,
    imageUrl: req.file.path,
    address_line_1: address_line_1,
    address_line_2: address_line_2,
    city: city,
    postal_code: postal_code,
    country: country,
    telephone: telephone,
    mobile: mobile,
    admin_cvShop: userId,
  });
  try {
    const existAdress = await Adress.findOne({ admincvShop: userId });
    if (existAdress) {
      clearImg(req.file.path);
      return res.status(404).json({ message: "Adress already exists" });
    }
    await creatAdress.save();
    const adressAdmin = await Adress.findOne({ admin_cvShop: userId }).populate(
      "admin_cvShop",
      "email"
    );
    res
      .status(200)
      .json({ message: "Adress created successfully", Adress: adressAdmin });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  createAdress,
};
