const Product = require("../model/admin");
const { validationResult } = require("express-validator");

const admin1 = {
  _id: "62699cc64ae9329b383dbe71",
};
const admin2 = {
  _id: "62699cc64ae9329b383dbe84",
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const admin = admin2;

  const product = new Product({
    title: req.body.title.toLowerCase(),
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    like: req.body.like,
    quantity: req.body.quantity,
    price: req.body.price,
    category: req.body.category,
    confirmDisplay: req.body.confirmDisplay,
    admin: admin,
  });
  console.log("Pduct: ", product);
  try {
    await product.save();
    res.status(201).json({
      message: "Product created successfully!",
      data: product,
      creator: { _id: admin._id, name: "test" },
    });
  } catch (err) {
    console.log(err);
  }
};

const getProductsIdAll = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const admin = admin1;

  try {
    const products = await Product.find({ admin: admin._id });
    if (products.length <= 0) {
      return res.status(404).json({ message: "Could not find products !" });
    }
    res.status(200).json({ message: "Products fetched", products: products });
  } catch (err) {
    console.log(err);
  }
};

const getProductsNameTitleAll = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const title = req.params.name.toLowerCase();
  const admin = admin2._id;
  try {
    const products = await Product.find({ title: title, admin: admin });
    if (products.length <= 0) {
      return res.status(404).json({ message: "Could not find products !" });
    }
    res.status(200).json({ message: "Products fetched", products: products });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createProduct,
  getProductsIdAll,
  getProductsNameTitleAll,
};
