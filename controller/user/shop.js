const Products = require("../../model/admin/product");
const Order = require("../../model/user/order");
const objLength = require("../../lib/object-length");
const AdressUser = require("../../model/user/adress");

const OrderInProgress = require("../../model/user/orderInProgress");
const OrderInProgressAdmin = require("../../model/admin/orderInProgress");

function addOrderProgress(product) {
  const orderItem = product;
  if (typeof orderItem != "object") {
    return null;
  }

  orderItem.forEach((value) => {
    delete value.Admin;
  });

  const ListAdminIdOrder = [
    ...new Set(orderItem.map((value) => value.admin)).values(),
  ];

  const hashmapAdminOrder = new Map();

  for (let i = 0; i < ListAdminIdOrder.length; i++) {
    const orders = orderItem.filter(
      (value) => value.admin == ListAdminIdOrder[i]
    );

    hashmapAdminOrder.set(ListAdminIdOrder[i], orders);
  }
  let newResult = [];

  hashmapAdminOrder.forEach((value, key) => {
    const reduced = value.reduce(
      (r, { price, quantity }) => {
        r["quantityTotal"] += quantity;
        r["priceTotal"] += price * quantity;
        return r;
      },
      { quantityTotal: 0, priceTotal: 0, admin: key }
    );
    reduced["products"] = value;

    newResult.push(reduced);
  });

  return newResult;
}

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

const postOrderInProgress = async (req, res, next) => {
  const userId = req.userId;
  const products = req.body;

  if (objLength(products.items) !== 2 || objLength(products.products) <= 0) {
    return res.status(422).json({ message: "Order is empty" });
  }

  try {
    const name = await AdressUser.findOne({ user: userId }).populate(
      "user",
      "email"
    );
    if (!name) {
      return res.status(404).json({ message: "Could not find User !" });
    }
    const resultProd = await products.products.map((i) => {
      return { products: { ...i } };
    });
    const order = new OrderInProgress({
      user: {
        userId: userId,
        name: name.firstname,
        email: name.user.email,
      },
      userValidation: false,
      adminValidation: false,
      quantityTotal: products.items.quantityTotal,
      priceTotal: products.items.priceTotal,
      products: resultProd,
    });
    const user = {
      userId: userId,
      name: name.firstname,
      email: name.user.email,
      mobile: name.mobile,
    };

    const result = addOrderProgress(products.products);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Current order not registered !" });
    }

    const postOrder = result.map(async (i) => {
      const productsSave = [];
      const a = new OrderInProgressAdmin({
        priceTotal: i.priceTotal,
        quantityTotal: i.quantityTotal,
        products: i.products,
        user: user,
        userValidation: i.userValidation || false,
        adminValidation: i.adminValidation || false,
      });
      const result = await a.save();
      productsSave.push(await result);
      // console.log("productsSave: ", productsSave);
      return result;
    });
    console.log("productsSave: ", productsSave);
    console.log("postOrder: ", postOrder);
    return res
      .status(200)
      .json({ message: "Validated orders", order: postOrder });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postOrder = async (req, res, next) => {
  const userId = req.userId;
  const products = req.body;

  if (objLength(products.items) !== 2 || objLength(products.products) <= 0) {
    return res.status(422).json({ message: "Order is empty" });
  }

  try {
    const name = await AdressUser.findOne({ user: userId }).populate(
      "user",
      "email"
    );
    if (!name) {
      return res.status(404).json("Could not find User !");
    }
    const resultProd = await products.products.map((i) => {
      return { products: i };
    });
    const order = new Order({
      user: {
        userId: userId,
        name: name.firstname,
        email: name.user.email,
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
  postOrderInProgress,
};
