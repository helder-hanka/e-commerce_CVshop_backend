const multer = require("multer");
const fs = require("fs");
const imageUserAdress = "./images/adress/users";

if (!fs.existsSync(imageUserAdress)) {
  fs.mkdirSync(imageUserAdress, { recursive: true });
}
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case "imageUserAdress":
        cb(null, imageUserAdress);
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
