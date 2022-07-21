const Admin = require("../../model/admin/admin");

const getPaymentsAdminAllById = async (req, res, next) => {
  const id = req.userId;
  try {
    const payments = await Admin.findById(
      id,
      "email image display admin_cvShop createdAt updatedAt"
    )
      .populate("Payments")
      .populate("adress");
    if (!payments) {
      return res.status(404).json({ message: "Could not find payments" });
    }
    if (!payments.Payments.length) {
      return res.status(404).json({ message: "Could not find payments" });
    }
    res.status(200).json({ message: "Fetched", payments: payments });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getPaymentById = async (req, res, next) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const payments = await Admin.findById(
      userId,
      "email image display adminCvShop createdAt updatedAt"
    )
      .populate({
        path: "Payments",
        match: { _id: id },
      })
      .populate("Adress");
    if (!payments) {
      return res.status(404).json({ message: "Could not find payments" });
    }
    if (!payments.Payments.length) {
      return res.status(404).json({ message: "Could not find payments" });
    }
    res.status(200).json({ message: "Fetched", payments: payments });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getPaymentsAdminAllById,
  getPaymentById,
};
