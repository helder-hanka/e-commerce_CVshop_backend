const { validationResult } = require("express-validator");
const Payment = require("../../../model/admin/payments");
const Admin = require("../../../model/admin/admin");
const addMonths = require("../../../lib/addMonths");

const createPayment = async (req, res, next) => {
  const userId = req.userId;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  const body = req.body;
  const payment = new Payment({
    amount: body.amount,
    payment_type: body.payment_type.toLowerCase(),
    provider: body.provider.toLowerCase(),
    account_no: body.account_no,
    expiry: addMonths(1),
    permissions: body.permissions,
    paymentDate: new Date(),
    comments: body.comments.toLowerCase(),
    validatePaymentReceved: body.validatePaymentReceved,
    confirmPaymentGive: body.confirmPaymentGive,
    admin_cvShop: userId,
    admin: body.admin,
  });

  try {
    const result = await payment.save();
    res
      .status(200)
      .json({ message: "Payment create successfully", payment: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getPaymentsAdminAllById = async (req, res, next) => {
  const id = req.params.id;
  console.log("ID :", id);
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
  const { adminId, paymentId } = req.params;

  try {
    const payments = await Admin.findById(
      adminId,
      "email image display adminCvShop createdAt updatedAt"
    )
      .populate({
        path: "Payments",
        match: { _id: paymentId },
      })
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

module.exports = {
  createPayment,
  getPaymentsAdminAllById,
  getPaymentById,
};
