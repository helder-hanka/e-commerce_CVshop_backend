const router = require("express").Router();
const { body } = require("express-validator");
const productController = require("../controller/adminProducts");
const adminLikesController = require("../controller/adminLikes");
const adminAdress = require("../controller/adminAdress");
const uploadImagesProducts = require("../middlewares/multerProducts");
const uploadImageAdress = require("../middlewares/multerAdress");
const isAuth = require("../middlewares/is-auth");

router.post(
  "/",
  isAuth,
  uploadImagesProducts.array("images", 4),
  [
    body("title", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("description", "Please enter a text end least 6 characters")
      .trim()
      .isLength({ min: 6 })
      .isString(),
    body("like", "Please enter a number").trim().isInt(),
    body("quantity", "Please enter a number").trim().isInt(),
    body("price", "Please enter a number").trim().isInt(),
    body("category", "Please enter a text end the requested categories")
      .custom((value, { req }) => {
        const category = [
          "clothes",
          "cars",
          "homeAppliance",
          "decorations",
          "computerScience",
          "books",
        ];

        function checkAvailability(arr, val) {
          return arr.some((arrVal) => val === arrVal);
        }

        if (!checkAvailability(category, req.body.category)) {
          throw new Error(`Please use this category: ${category}`);
        }
        return true;
      })
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body(
      "confirmDisplay",
      "Please confirm the display true or false"
    ).isBoolean(),
  ],
  productController.createProduct
);
router.get("/", isAuth, productController.getProductsAdminIdAll);
router.get("/title/:name", isAuth, productController.getProductsNameTitleAll);
router.get(
  "/category/:name",
  isAuth,
  productController.getProductsNameCategoryAll
);
router.get("/:id", isAuth, productController.getProductId);
router.put(
  "/:id",
  isAuth,
  uploadImagesProducts.array("images", 4),
  [
    body("title", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("description", "Please enter a text end least 6 characters")
      .trim()
      .isLength({ min: 6 })
      .isString(),
    body("like", "Please enter a number").trim().isInt(),
    body("quantity", "Please enter a number").trim().isInt(),
    body("price", "Please enter a number").trim().isInt(),
    body("category", "Please enter a text end the requested categories")
      .custom((value, { req }) => {
        const category = [
          "clothes",
          "cars",
          "homeAppliance",
          "decorations",
          "computerScience",
          "books",
        ];

        function checkAvailability(arr, val) {
          return arr.some((arrVal) => val === arrVal);
        }

        if (!checkAvailability(category, req.body.category)) {
          throw new Error(`Please use this category: ${category}`);
        }
        return true;
      })
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body(
      "confirmDisplay",
      "Please confirm the display true or false"
    ).isBoolean(),
  ],
  productController.updateProduct
);
router.delete("/:id", isAuth, productController.deleteProduct);
router.get("/like/:id", isAuth, adminLikesController.getLikesById);
router.put(
  "/like/:id",
  isAuth,
  [
    body("like", "The like must be a string!")
      .trim()
      .isString()
      .custom((value, { req }) => {
        const gender = ["Like", "UnLike"];
        const isValid = gender.some((arr) => arr === req.body.like);
        if (!isValid) {
          throw new Error(`Please use this gender: ${gender}`);
        }
        return true;
      }),
  ],
  adminLikesController.updateLikes
);
router.post(
  "/adress",
  isAuth,
  uploadImageAdress.single("image"),
  [
    body("firstname", "Please enter a text end least 3 characters")
      .trim()
      .isString()
      .isLength({ min: 3 }),
    body("lastname", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("gender").custom((value, { req }) => {
      const gender = ["male", "female"];
      const isValid = gender.some(
        (arr) => arr === req.body.gender.toLowerCase()
      );
      if (!isValid) {
        throw new Error(`Please use this gender: ${gender}`);
      }
      return true;
    }),
    body("address_line_1", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ max: 50 })
      .isString(),
    body("address_line_2", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ max: 50 })
      .isString(),
    body("city", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("postal_code", "Please enter a number").trim().isInt(),
    body("country", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("telephone", "Please enter a number").trim().isInt(),
    body("mobile", "Please enter a number").trim().isInt(),
  ],
  adminAdress.createAdress
);
router.get("/adress/:id", isAuth, adminAdress.getAdressById);
router.put(
  "/adress/:id",
  isAuth,
  uploadImageAdress.single("image"),
  [
    body("firstname", "Please enter a text end least 3 characters")
      .trim()
      .isString()
      .isLength({ min: 3 }),
    body("lastname", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("gender").custom((value, { req }) => {
      const gender = ["male", "female"];
      const isValid = gender.some(
        (arr) => arr === req.body.gender.toLowerCase()
      );
      if (!isValid) {
        throw new Error(`Please use this gender: ${gender}`);
      }
      return true;
    }),
    body("address_line_1", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ max: 50 })
      .isString(),
    body("address_line_2", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ max: 50 })
      .isString(),
    body("city", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("postal_code", "Please enter a number").trim().isInt(),
    body("country", "Please enter a text end least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("telephone", "Please enter a number").trim().isInt(),
    body("mobile", "Please enter a number").trim().isInt(),
  ],
  adminAdress.updatedAdress
);
module.exports = router;
