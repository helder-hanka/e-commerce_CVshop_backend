const { validationResult } = require("express-validator");
const Product = require("../model/product");
const Admin = require("../model/admin");
const ProductsDeleted = require("../model/productsDeleted");
// const path = require("path");

const admin1 = {
  _id: "62b0cf62ab63b161acaaabc1",
};
const admin2 = {
  _id: "62b0cf89977a00d1d2bfa514",
};
const admin3 = {
  _id: "",
};
const admin4 = {
  _id: "62ae53456aed6b27bc7d50b4",
};
const product1 = {
  _id: "62ae7003269decb4258d4fac",
};

const admin = admin1._id;

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.files.length) {
    return res.status(422).json({ message: "No image provided" });
  }
  const files = req.files.map((p) => p.path);
  const product = new Product({
    title: req.body.title.toLowerCase(),
    description: req.body.description,
    imageUrl: files,
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
  const admin = admin1._id;
  try {
    const products = await Product.find({
      title: title,
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

const getProductsNameCategoryAll = async (req, res, next) => {
  const category = req.params.name.toLowerCase();
  const admin = admin1._id;
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
  const admin = admin1._id;
  try {
    const products = await Product.findById(id).populate({
      path: "admin",
      select: "email",
    });

    if (!products || !products.admin._id.toString()) {
      return res.status(404).json({ message: "Could not find product" });
    }
    if (admin !== products.admin._id.toString()) {
      return res.status(404).json({ message: "Not authorized" });
    }
    res.status(200).json({ message: "Products fetched", products: products });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const admin = admin1._id;

  const title = req.body.title.toLowerCase();
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const like = req.body.like;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const category = req.body.category.toLowerCase();
  const confirmDisplay = req.body.confirmDisplay;

  try {
    const product = await Product.findById(id).populate({
      path: "admin",
      select: "email",
    });
    if (!product || !product.admin) {
      return res.status(404).json({ message: "Could not find product" });
    }
    if (admin !== product.admin._id.toString()) {
      return res.status(404).json({ message: "Not authorized" });
    }

    product.title = title;
    product.description = description;
    product.imageUrl = imageUrl;
    product.like = like;
    product.quantity = quantity;
    product.price = price;
    product.category = category.toLowerCase();
    product.confirmDisplay = confirmDisplay;
    const result = await product.save();
    res.status(200).json({
      message: "Product updated",
      product: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  const id = req.params.id;
  const admin = admin1._id;
  try {
    const product = await Product.findById(id);
    if (!product || !product.admin.toString()) {
      return res.status(404).json({ message: "Could not find product!" });
    }
    if (admin !== product.admin.toString()) {
      return res.status(404).json({ message: "Not authorized" });
    }
    const post = new ProductsDeleted({
      productId: product._id.toString(),
      title: product.title,
      description: product.description,
      imageUrl: product.imageUrl,
      like: product.like,
      quantity: product.quantity,
      price: product.price,
      category: product.category,
      confirmDisplay: product.confirmDisplay,
      admin: product.admin.toString(),
    });
    await post.save();
    await Product.findByIdAndRemove(id);
    console.log(post);
    res.status(200).json({ message: "Deleted post." });
  } catch (error) {
    if (!err.statusCode) {
      error.statusCode = 500;
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
  updateProduct,
  deleteProduct,
};
