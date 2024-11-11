const { validationResult } = require("express-validator");
const Adress = require("../../model/adminCvShop/adress");
const clearImg = require("../../lib/clearImg");

const createAdress = async (req, res, next) => {
  const userId = req.userId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    clearImg(req.file.path);
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
    const existAdress = await Adress.findOne({ admin_cvShop: userId });
    console.log(existAdress);
    console.log(userId);
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

const getAdressById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const adress = await Adress.findOne({ admin_cvShop: id }).populate(
      "admin_cvShop",
      "email"
    );

    if (!adress) {
      return res.status(404).json({ message: "Could not find adress" });
    }
    res.status(200).json({ message: "Adress fetched", adress: adress });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const updatedAdress = async (req, res, next) => {
  const id = req.params.id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    clearImg(req.file.path);
    return res.status(400).json({ message: errors.array() });
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
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    return res.status(422).json({ message: "No file picked" });
  }

  try {
    const adress = await Adress.findOne({ admin_cvShop: id });
    if (!adress) {
      return res.status(404).json({ message: "Could not find" });
    }
    if (imageUrl !== adress.imageUrl) {
      clearImg(adress.imageUrl);
    }

    adress.firstname = firstname;
    adress.lastname = lastname;
    adress.gender = gender;
    adress.imageUrl = imageUrl;
    adress.address_line_1 = address_line_1;
    adress.address_line_2 = address_line_2;
    adress.city = city;
    adress.postal_code = postal_code;
    adress.country = country;
    adress.telephone = telephone;
    adress.mobile = mobile;

    const result = await adress.save();
    res.status(200).json({ message: "Adress updated!", adress: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  createAdress,
  getAdressById,
  updatedAdress,
};
