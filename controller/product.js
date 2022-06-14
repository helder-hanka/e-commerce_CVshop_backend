const Product = require("../model/product");
const { validationResult } = require("express-validator");

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const admin = {
    _id: "62699cc64ae9329b383dbe71",
  };
  const product = new Product({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    like: req.body.like,
    quantity: req.body.quantity,
    price: req.body.price,
    category: req.body.category,
    confirmDisplay: req.body.confirmDisplay,
    productsNumber: req.body.productsNumber,
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

module.exports = {
  createProduct,
};
