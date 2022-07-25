const { validationResult } = require("express-validator");
const Admin = require("../../../model/admin/admin");
const payments = require("../../../model/admin/payments");

const getDisplayAdmin = async (req, res, next) => {
  const { min, max } = req.params;
  try {
    const admin = await Admin.find(null, "email display admin_cvShop")
      .populate("adress")
      .populate({
        path: "Payments",
        match: {
          expiry: {
            $gte: min,
            $lte: max,
          },
        },
        options: { sort: { expiry: -1 } },
      });
    if (!admin) {
      return res.status(404).json({ message: "Could not find" });
    }
    res.status(200).json({ message: "Fetched", admin: admin });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const UpdateDisplayAdmin = async (req, res, next) => {
  const id = req.params.id;
  const display = req.body.display;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Could not found" });
    }
    if (admin._id.toString() !== id) {
      return res.status(406).json({ message: "The Id is not identical" });
    }
    admin.display = display;
    const isdisplay = await admin.save();

    res.status(200).json({ message: "Updated", admin: isdisplay });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getDisplayAdmin,
  UpdateDisplayAdmin,
};
