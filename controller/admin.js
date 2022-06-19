const { validationResult } = require("express-validator");
const Product = require("../model/product");
const Admin = require("../model/admin");
const product = require("../model/product");

// const a = new Admin({
//   email: "test@gmail.com",
//   password: "azerty",
// });
// a.save();

const admin1 = {
  _id: "62699cc64ae9329b383dbe71",
};
const admin2 = {
  _id: "62699cc64ae9329b383dbe84",
};
const admin3 = {
  _id: "62ae4bab90595ba44d545422",
};
const admin4 = {
  _id: "62ae53456aed6b27bc7d50b4",
};
const product1 = {
  _id: "62ae7003269decb4258d4fac",
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const admin = admin3;

  const product = new Product({
    title: req.body.title.toLowerCase(),
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    like: req.body.like,
    quantity: req.body.quantity,
    price: req.body.price,
    category: req.body.category.toLowerCase(),
    confirmDisplay: req.body.confirmDisplay,
    admin: admin,
  });
  try {
    await product.save();
    res.status(201).json({
      message: "Product created successfully!",
      data: product,
      creator: { _id: admin._id, name: "test" },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getProductsAdminIdAll = async (req, res, next) => {
  const admin = admin3._id;

  try {
    const products = await Product.find({ admin: admin }).populate({
      path: "admin",
      select: "email",
    });
    const result = await products.filter((p) => p.admin._id.toString());

    if (result.length <= 0) {
      return res.status(404).json({ message: "Could not find products !" });
    }
    res.status(200).json({
      message: "Products fetched",
      products: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getProductsNameTitleAll = async (req, res, next) => {
  const title = req.params.name.toLowerCase();
  const admin = admin3._id;
  try {
    const products = await Product.find({
      title: title,
      admin: admin,
    }).populate();
    const result = await products.filter((p) => p.admin._id.toString());
    if (products.length <= 0) {
      return res.status(404).json({ message: "Could not find products !" });
    }
    res.status(200).json({ message: "Products fetched", products: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getProductsNameCategoryAll = async (req, res, next) => {
  const category = req.params.name.toLowerCase();
  const admin = admin3._id;
  try {
    const products = await Product.find({
      category: category,
      admin: admin,
    }).populate({
      path: "admin",
      select: "email",
    });
    const result = await products.filter((p) => p.admin._id.toString());
    if (products.length <= 0) {
      return res.status(404).json({ message: "Could not find products !" });
    }
    res.status(200).json({ message: "Products fetched", products: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getProductId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const admin = admin3._id;
  try {
    const products = await Product.findById(id).populate("admin");
    console.log("admin: ", admin, "Product: ", products);
    if (admin !== products.admin._id.toString()) {
      const error = new Error("Not authorized");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Products fetched", products: products });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  createProduct,
  getProductsAdminIdAll,
  getProductsNameTitleAll,
  getProductsNameCategoryAll,
  getProductId,
};
