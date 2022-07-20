const { validationResult } = require("express-validator");
const Adress = require("../../model/admin/adress");
const clearImg = require("../../lib/clearImg");

const createAdress = async (req, res, next) => {
  const adminId = req.userId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(422).json({ message: "No image provided" });
  }
  const creatAdress = new Adress({
    firstname: req.body.firstname.toLowerCase(),
    lastname: req.body.lastname.toLowerCase(),
    gender: req.body.gender.toLowerCase(),
    admin: adminId,
    imageUrl: req.file.path,
    address_line_1: req.body.address_line_1.toLowerCase(),
    address_line_2: req.body.address_line_2.toLowerCase(),
    city: req.body.city.toLowerCase(),
    postal_code: req.body.postal_code,
    country: req.body.country.toLowerCase(),
    telephone: req.body.telephone,
    mobile: req.body.mobile,
  });
  try {
    const adress = await Adress.find({ admin: adminId }).populate({
      path: "admin",
      select: "email",
    });

    if (!adress.length <= 0) {
      clearImg(req.file.path);
      return res.status(404).json({ message: "Adress already exists" });
    }
    await creatAdress.save();
    const adressAdmin = await Adress.find({ admin: adminId }).populate({
      path: "admin",
      select: "email",
    });
    res.status(200).json({
      message: "Adress created successfully",
      adress: creatAdress,
      admin: { _id: adressAdmin[0].admin._id, name: adressAdmin[0].firstname },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getAdressById = async (req, res, next) => {
  const adminId = req.userId;
  const adminReqId = req.params.id;
  try {
    const adress = await Adress.find({ admin: adminReqId }).populate({
      path: "admin",
      select: "email",
    });

    if (!adress.length || !adress[0].admin._id.toString()) {
      const error = new Error("Could not find adress");
      throw error;
    }

    if (adress[0].admin._id.toString() !== adminId) {
      const error = new Error("Not authorized");
      throw error;
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
  const adminId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const firstname = req.body.firstname.toLowerCase();
  const lastname = req.body.lastname.toLowerCase();
  const gender = req.body.gender.toLowerCase();
  let imageUrl = req.body.image;
  const address_line_1 = req.body.address_line_1.toLowerCase();
  const address_line_2 = req.body.address_line_2.toLowerCase();
  const city = req.body.city.toLowerCase();
  const postal_code = req.body.postal_code;
  const country = req.body.country.toLowerCase();
  const telephone = req.body.telephone;
  const mobile = req.body.mobile;

  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    return res.status(422).json({ message: "No file picked" });
  }

  try {
    const adress = await Adress.find({ admin: id }).populate({
      path: "admin",
      select: "email",
    });

    if (!adress.length || !adress[0].admin._id.toString()) {
      const error = new Error("Could not find");
      error.statusCode = 404;
      throw error;
    }

    if (adminId !== adress[0].admin._id.toString()) {
      const error = new Error("Not authorized!");
      error.statusCode = 404;
      throw error;
    }
    if (imageUrl !== adress[0].imageUrl) {
      clearImg(adress[0].imageUrl);
    }

    adress[0].firstname = firstname;
    adress[0].lastname = lastname;
    adress[0].gender = gender;
    adress[0].imageUrl = imageUrl;
    adress[0].address_line_1 = address_line_1;
    adress[0].address_line_2 = address_line_2;
    adress[0].city = city;
    adress[0].postal_code = postal_code;
    adress[0].country = country;
    adress[0].telephone = telephone;
    adress[0].mobile = mobile;

    const result = await adress[0].save();
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
