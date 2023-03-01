const { validationResult } = require("express-validator");
const Product = require("../../model/admin/product");
const ProductsDeleted = require("../../model/admin/productsDeleted");
const OrderInProgressAdmin = require("../../model/admin/orderInProgress");

const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");

const createProduct = async (req, res, next) => {
  const admin = req.userId;
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
  const admin = req.userId;
  try {
    const products = await Product.find({ admin: admin }).populate({
      path: "admin",
      select: "email",
    });

    const isAdmin = products.map((adm) => adm.admin);
    if (isAdmin === null) {
      return res
        .status(404)
        .json({ message: "Could not find admin products!" });
    }
    const result = products.filter((p) => p.admin.toString());

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
  const admin = req.userId;
  try {
    const products = await Product.find({
      title: title,
      admin: admin,
    }).populate({
      path: "admin",
      select: "email",
    });
    const result = products.filter((p) => p.admin._id.toString());
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
  const admin = req.userId;
  try {
    const products = await Product.find({
      category: category,
      admin: admin,
    }).populate({
      path: "admin",
      select: "email",
    });
    const result = products.filter((p) => p.admin._id.toString());
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
  const admin = req.userId;
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
  const admin = req.userId;
  const title = req.body.title.toLowerCase();
  const description = req.body.description;
  let imageUrl = req.body.images;
  const like = req.body.like;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const category = req.body.category.toLowerCase();
  const confirmDisplay = req.body.confirmDisplay;
  if (req.files.length) {
    const files = req.files.map((p) => p.path);
    imageUrl = files;
  }
  if (!imageUrl) {
    return res.status(422).json({ message: "No file picked.!" });
  }

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

    const array3 = product.imageUrl.filter(
      (entry1) => !imageUrl.some((entry2) => entry1 === entry2)
    );

    if (array3.length) {
      array3.map((x) => clearImage(x));
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
  const admin = req.userId;
  try {
    const product = await Product.findById(id);
    if (!product || !product.admin.toString()) {
      return res.status(404).json({ message: "Could not find product!" });
    }
    if (admin !== product.admin.toString()) {
      return res.status(404).json({ message: "Not authorized" });
    }
    const productImg = product.imageUrl;

    const resultImg = productImg.map((img) => {
      const i = img.slice(16);
      return `images/productsDelete/${i}`;
    });

    moveImgInProductSDelete(productImg);
    const post = new ProductsDeleted({
      productId: product._id.toString(),
      title: product.title,
      description: product.description,
      imageUrl: resultImg,
      like: product.like,
      quantity: product.quantity,
      price: product.price,
      category: product.category,
      confirmDisplay: product.confirmDisplay,
      admin: product.admin.toString(),
    });
    await post.save();
    await Product.findByIdAndRemove(id);
    res.status(200).json({ message: "Deleted post." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const moveImgInProductSDelete = (src) => {
  src.map((i) =>
    fse.move(i, `./images/productsDelete/${i.slice(16)}`, (err) => {
      if (err) return console.error(err);
    })
  );
};

const getOrderInProgressAdmin = async (req, res, next) => {
  const adminId = req.userId;
  const page = +req.query || 1;
  let totalItems;
  const ITEMS_PER_PAGE = 10;
  console.log(adminId);

  try {
    const getProducts = await OrderInProgressAdmin.find({
      adminId: adminId,
    })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    if (getProducts.length <= 0) {
      return res.status(404).json({ message: "Products not found !" });
    }

    totalItems = await OrderInProgressAdmin.find({
      adminId: adminId,
    }).countDocuments();

    return res.status(200).json({
      message: "Fetched",
      products: getProducts,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

module.exports = {
  createProduct,
  getProductsAdminIdAll,
  getProductsNameTitleAll,
  getProductsNameCategoryAll,
  getProductId,
  updateProduct,
  deleteProduct,
  getOrderInProgressAdmin,
};
