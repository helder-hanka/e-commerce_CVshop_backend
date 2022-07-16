const multer = require("multer");
var fs = require("fs");
var dir = "./images/adress/adminCvShop";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
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
