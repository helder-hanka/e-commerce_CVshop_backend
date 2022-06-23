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

const admin = admin1;

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

module.exports = {
  createAdress,
};
