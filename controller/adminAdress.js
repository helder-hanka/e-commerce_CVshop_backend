const { validationResult } = require("express-validator");
const Adress = require("../model/adminAdress");

const admin1 = {
  _id: "62b0cf62ab63b161acaaabc1",
  name: "POLIE",
};
const admin2 = {
  _id: "62b0cf89977a00d1d2bfa514",
  name: "Carol",
};

const admin = admin2;

const createAdress = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const creatAdress = new Adress({
    firstname: req.body.firstname.toLowerCase(),
    lastname: req.body.lastname.toLowerCase(),
    gender: req.body.gender.toLowerCase(),
    admin: admin,
    imageUrl: req.body.imageUrl,
    address_line_1: req.body.address_line_1.toLowerCase(),
    address_line_2: req.body.address_line_2.toLowerCase(),
    city: req.body.city.toLowerCase(),
    postal_code: req.body.postal_code,
    country: req.body.country.toLowerCase(),
    telephone: req.body.telephone,
    mobile: req.body.mobile,
  });
  try {
    const adress = await Adress.find({ admin: admin }).populate({
      path: "admin",
      select: "email",
    });

    if (adress.length <= 0) {
      await creatAdress.save();
      return res.status(200).json({
        message: "Adress created successfully",
        adress: creatAdress,
        admin: { _id: admin._id, name: admin.name },
      });
    }
    if (adress[0].admin._id.toString() !== admin._id) {
      console.log("2 OK");
      return res.status(404).json({ message: "Not authorized!" });
    }
    res.status(404).json({ message: "Adress already exists" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getAdressById = async (req, res, next) => {
  const adminId = req.params.id;
  const userId = req.params.id;
  try {
    const adress = await Adress.find({ admin: adminId }).populate({
      path: "admin",
      select: "email",
    });

    console.log(adress.length);
    if (!adress.length || !adress[0].admin._id.toString()) {
      console.log("ok");
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
  const userId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw err;
  }

  const firstname = req.body.firstname.toLowerCase();
  const lastname = req.body.lastname.toLowerCase();
  const gender = req.body.gender.toLowerCase();
  const imageUrl = req.body.imageUrl;
  const address_line_1 = req.body.address_line_1.toLowerCase();
  const address_line_2 = req.body.address_line_2.toLowerCase();
  const city = req.body.city.toLowerCase();
  const postal_code = req.body.postal_code;
  const country = req.body.country.toLowerCase();
  const telephone = req.body.telephone;
  const mobile = req.body.mobile;

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

    if (userId !== adress[0].admin._id.toString()) {
      const error = new Error("Not authorized!");
      error.statusCode = 404;
      throw error;
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
    console.log("result: => ", result);
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
