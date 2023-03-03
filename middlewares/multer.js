const multer = require("multer");
const fs = require("fs");
const imageUserAdress = "./images/adress/users";
const adminAdressImg = "./images/adress/admin";
const adminCvShopAdressImg = "./images/adress/adminCvShop";
const adminCvShopImg = "./images/adminCvShop";
const productImg = "./images/products";

if (!fs.existsSync(imageUserAdress)) {
  fs.mkdirSync(imageUserAdress, { recursive: true });
}
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case "imageUserAdress":
        cb(null, imageUserAdress);
        break;
      case "adminAdressImg":
        cb(null, adminAdressImg);
        break;
      case "adminCvShopAdressImg":
        cb(null, adminCvShopAdressImg);
        break;
      case "adminCvShopImg":
        cb(null, adminCvShopImg);
        break;
      case "productImg":
        cb(null, productImg);
        break;
      default:
        cb(null, "It's not valid");
    }
  },
  filename: (req, file, cb) => {
    const match = ["image/png", "image/jpeg", "image/jpg"];
    if (match.indexOf(file.mimetype) === -1) {
      const message = `${file.originalname} is invalid. Only accept image/png", "image/jpeg", "image/jpg.`;
      return cb(null, message);
    }
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        "_" +
        file.originalname
    );
  },
});
const upload = multer({ storage: fileStorageEngine });
module.exports = upload;
