const { validationResult } = require("express-validator");
const Adress = require("../../model/user/adress");
const clearImg = require("../../lib/clearImg");

const createAdress = async (req, res, next) => {
  const userId = req.userId;
  let img;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (req.file) {
    img = req.file.path;
  }
  const creatAdress = new Adress({
    firstname: req.body.firstname.toLowerCase(),
    lastname: req.body.lastname.toLowerCase(),
    gender: req.body.gender.toLowerCase(),
    user: userId,
    imageUrl: img,
    address_line_1: req.body.address_line_1.toLowerCase(),
    address_line_2: req.body.address_line_2.toLowerCase(),
    city: req.body.city.toLowerCase(),
    postal_code: req.body.postal_code.toLowerCase(),
    country: req.body.country.toLowerCase(),
    telephone: req.body.telephone,
    mobile: req.body.mobile,
  });
  try {
    const adress = await Adress.find({ user: userId }).populate({
      path: "user",
      select: "email",
    });

    if (!adress.length <= 0) {
      if (req.file) {
        clearImg(req.file.path);
        return res.status(404).json({ message: "Adress already exists" });
      }
      return res.status(404).json({ message: "Adress already exists" });
    }
    await creatAdress.save();
    const adressUser = await Adress.find({ user: userId }).populate({
      path: "user",
      select: "email",
    });
    res.status(200).json({
      message: "Adress created successfully",
      adress: creatAdress,
      user: { _id: adressUser[0].user._id, name: adressUser[0].firstname },
    });
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
