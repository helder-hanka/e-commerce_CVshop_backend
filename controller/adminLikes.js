const { validationResult } = require("express-validator");
const Like = require("../model/adminLikes");
const Admin = require("../model/admin");
// const { count } = require("../model/adminLikes");
// const Adress = require("../model/adminAdress");

// const i = new Like({
//   admin: "62c1e00b27fd0d3186e4e0fa",
//   likes: 0,
// });

// i.save();

// const a = new Adress({
//   firstname: "neusa",
//   lastname: "fernandes j",
//   gender: "female",
//   admin: "62c1e00b27fd0d3186e4e0fa",
//   imageUrl: "kjhdksqdsqfdf",
//   address_line_1: "",
//   address_line_2: "",
//   city: "praia bacho",
//   postal_code: 5232,
//   country: "praia",
//   telephone: 1010101009,
//   mobile: 610015869,
// });
// a.save();

const getLikesById = async (req, res, next) => {
  const adminId = req.params.id;
  try {
    const admin = await Admin.findById(adminId)
      .populate(
        "adress",
        "firstname lastname gender imageUrl citycountry city country"
      )
      .populate("likes");
    if (!admin) {
      return res.status(404).json({ message: "Could not find like" });
    }
    res.status(200).json({ message: "Like fetched", admin: admin });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const updateLikes = async (req, res, next) => {
  const adminId = req.params.id;
  const userId = req.userId;
  const action = req.body.like;
  const counter = action === "Like" ? 1 : -1;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const adminLikes = await Like.findOne({ admin: adminId });
    if (!adminLikes) {
      res.status(404).json({ message: "Could not find like!" });
    }
    if (userId === adminLikes.admin.toString()) {
      return res.status(404).json({ message: "Not authorized" });
    }
    const isExist = adminLikes.users.some((user) => user.toString() === userId);
    if (isExist && action === "Like") {
      return res.status(404).json({ message: "Like already exist!" });
    }

    if (!isExist && action === "Like") {
      await adminLikes.users.push(userId);
      await adminLikes.save();
    }

    if (!isExist && action === "UnLike") {
      return res.status(404).json({ message: "Like Not exist!" });
    }

    if (action === "UnLike") {
      await adminLikes.users.pull(userId);
      await adminLikes.save();
    }

    const result = await Like.updateOne(
      { admin: adminId },
      { $inc: { likes: counter } }
    );

    res.status(200).json({ message: "Liked!", likes: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getLikesById,
  updateLikes,
};
