const { validationResult } = require("express-validator");
const Products = require("../../model/admin/product");
const Order = require("../../model/user/order");
const objLength = require("../../lib/object-length");

const getProductList = async (req, res, next) => {
  const rQuery = req.query;
  const page = req.query.page;
  const currentPage = page ? parseInt(page) : 1;
  const perpage = 20;

  let query = [
    {
      $lookup: {
        from: "admins",
        localField: "admin",
        foreignField: "_id",
        as: "Admin",
      },
    },
    { $unwind: "$Admin" },
    {
      $lookup: {
        from: "adminadresses",
        localField: "admin",
        foreignField: "admin",
        as: "Adress",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "admin",
        foreignField: "admin",
        as: "Like",
      },
    },
    {
      $match: { "Admin.display": true },
    },

    {
      $project: {
        title: 1,
        description: 1,
        like: 1,
        quantity: 1,
        price: 1,
        category: 1,
        confirmDisplay: 1,
        imageUrl: 1,
        admin: 1,
        createdAt: 1,
        Admin: [
          {
            _id: "$Admin._id",
            email: "$Admin.email",
            display: "$Admin.display",
          },
        ],
        Adress: "$Adress",
      },
    },
    { $unwind: "$Admin" },
    { $unwind: "$Adress" },
  ];
  const match = [
    {
      $match: {
        confirmDisplay: true,
        quantity: { $gt: 0 },
      },
    },
    { $skip: (currentPage - 1) * perpage },
    { $limit: perpage },
  ];

  if (!rQuery.length) {
    query.push(...match);
  }

  if (rQuery.title && rQuery.title != "") {
    match[0].$match.title = new RegExp("^" + rQuery.title + "$", "i");
    query.push(...match);
  }
  if (rQuery.category && rQuery.category != "") {
    match[0].$match.category = new RegExp("^" + rQuery.category + "$", "i");
    query.push(...match);
  }
  if (
    (rQuery.sortOrder && rQuery.sortOrder === "desc") ||
    rQuery.sortOrder === "asc"
  ) {
    let sort = "";
    sort = req.query.sortOrder === "asc" ? 1 : -1;
    query.push({ $sort: { createdAt: sort } });
  }
  try {
    const totalItems = await Products.countDocuments(query);
    const product = await Products.aggregate(query);

    if (!product.length) {
      return res.status(404).json({ message: "Could not find product" });
    }
    res
      .status(200)
      .json({ message: "Fetched", products: product, totalItems: totalItems });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postOrder = async (req, res, next) => {
  const errors = validationResult(req);
  const userId = req.userId;
  const products = req.body;
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  if (objLength(products.items) !== 2 || objLength(products.products) <= 0) {
    return res.status(422).json({ message: "Order is empty" });
  }

  try {
    const resultProd = await products.products.map((i) => {
      return { products: { ...i } };
    });
    const order = new Order({
      user: {
        userId: "62dea64ca0d502a1cea6858e",
        name: "user1",
        email: "user1@gmail.com",
      },
      quantityTotal: products.items.quantityTotal,
      priceTotal: products.items.priceTotal,
      products: resultProd,
    });
    const result = await order.save();
    return res.status(200).json({ message: "Validated orders", order: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getProductList,
  postOrder,
};
