const { validationResult } = require("express-validator");
const Product = require("../../model/admin/product");
const ProductsDeleted = require("../../model/admin/productsDeleted");
const BackOrder = require("../../model/adminAndUser/backorder");
const Orders = require("../../model/adminAndUser/Order");
const Payments = require("../../model/admin/payments");

const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const backorder = require("../../model/adminAndUser/backorder");
const calculatePercentage = require("../../lib/calculatePercentage");
const addMonths = require("../../lib/addMonths");

const createProduct = async (req, res, next) => {
  const admin = req.userId;
  const body = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.files.length) {
    return res.status(422).json({ message: "No image provided" });
  }
  const files = req.files.map((p) => p.path);
  const product = new Product({
    title: body.title.toLowerCase(),
    description: body.description,
    imageUrl: files,
    like: body.like,
    quantity: body.quantity,
    price: body.price,
    category: body.category.toLowerCase(),
    confirmDisplay: body.confirmDisplay,
    admin: admin,
    colors: body.colors,
    size: body.size,
    origin: body.origin,
    marque: body.marque,
    occasion: body.occasion,
    men: body.men,
    women: body.women,
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
  const body = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const admin = req.userId;
  const title = body.title.toLowerCase();
  const description = body.description;
  let imageUrl = body.images;
  const like = body.like;
  const quantity = body.quantity;
  const price = body.price;
  const category = body.category.toLowerCase();
  const confirmDisplay = body.confirmDisplay;
  const colors = body.colors.toLowerCase();
  const size = body.size.toLowerCase();
  const origin = body.origin.map((i) => i);
  const marque = body.marque.toLowerCase();
  const occasion = body.occasion;
  const men = body.men;
  const women = body.women;

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
    product.category = category;
    product.confirmDisplay = confirmDisplay;
    product.colors = colors;
    product.size = size;
    product.origin = origin;
    product.marque = marque;
    product.occasion = occasion;
    product.men = men;
    product.women = women;
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

const getOrderInProgressAdmin = async (req, res, next) => {
  const adminId = req.userId;
  const page = +req.query || 1;
  let totalItems;
  const ITEMS_PER_PAGE = 10;

  try {
    const getProducts = await BackOrder.find({
      adminId: adminId,
    })
      .populate({
        path: "adminId",
        populate: {
          path: "adress",
          select:
            "firstname lastname imageUrl address_line_1 city postal_code country mobile",
        },
        select: "email",
      })
      .populate({ path: "products.productId" })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    if (getProducts.length <= 0) {
      return res.status(404).json({ message: "Products not found !" });
    }

    totalItems = await BackOrder.find({
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

const validateOrder = async (req, res, next) => {
  const userId = req.userId;
  const validation = req.body;
  const productId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const produtcAdmin = await BackOrder.findById(productId).populate({
      path: "products.productId",
      select: "quantity",
    });
    if (!produtcAdmin) {
      return res.status(404).json({ message: "Could not find product" });
    }
    if (produtcAdmin.adminId.toString() !== userId) {
      return res.status(404).json({ message: "Not authorisation" });
    }

    if (!produtcAdmin.userValidation) {
      return res.status(404).json({ message: "wait for buyer validation" });
    }
    if (produtcAdmin.adminValidation) {
      return res.status(404).json({ message: "You have already validation" });
    }

    produtcAdmin.adminValidation = validation.validate;
    await produtcAdmin.save();

    const savOder = {
      userId: produtcAdmin.userId,
      adminId: produtcAdmin.adminId,
      userValidation: produtcAdmin.userValidation,
      adminValidation: produtcAdmin.adminValidation,
      products: {
        productId: produtcAdmin.products[0].productId,
        quantityBuy: produtcAdmin.products[0].quantityBuy,
        priceBuy: produtcAdmin.products[0].priceBuy,
      },
    };
    await Orders(savOder).save();

    let newQuantity = (produtcAdmin.products[0].productId.quantity -=
      produtcAdmin.products[0].quantityBuy);

    await Product.findByIdAndUpdate(produtcAdmin.products[0].productId, {
      quantity: newQuantity,
    });
    await produtcAdmin.save();

    const totalPercentage = 20;
    const resultPrice = calculatePercentage(
      totalPercentage,
      produtcAdmin.products[0].priceBuy
    );

    const savePayment = new Payments({
      amount: resultPrice,
      payment_type: "auto validate",
      expiry: addMonths(1),
      permissions: true,
      paymentDate: new Date(),
      validatePaymentReceved: false,
      confirmPaymentGive: false,
      admin: userId,
    });

    await savePayment.save();

    await backorder.findByIdAndDelete(productId);

    res.status(200).json({ validate: "Validation udated" });
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
  validateOrder,
};
