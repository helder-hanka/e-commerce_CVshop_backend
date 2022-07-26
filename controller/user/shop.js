const Admin = require("../../model/admin/admin");
const Products = require("../../model/admin/product");

const getProductAll = async (req, res, next) => {
  try {
    const product = await Admin.find({ display: true }, "email")
      .populate("adress", "firstname lastname city country")
      .populate("likes")
      .populate({ path: "Products", match: { quantity: { $gt: 0 } } });

    if (!product) {
      return res.status(404).json({ message: "Could not find product" });
    }
    res.status(200).json({ message: "Fetched", product: product });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getProductByName = async (req, res, next) => {
  const name = req.params.name;

  try {
    const product = await Products.find({
      title: new RegExp("^" + name + "$", "i"),
      confirmDisplay: true,
      quantity: { $gt: 0 },
    }).populate({
      path: "admin",
      match: { display: true },
      select: "email",
      populate: { path: "adress", select: "firstname lastname city country" },
      populate: { path: "likes", select: "likes" },
    });

    if (!product.length) {
      return res.status(404).json({ message: "Could not find product" });
    }
    res.status(200).json({ message: "Fetched", product: product });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getProductAll,
  getProductByName,
};
