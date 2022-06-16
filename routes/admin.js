// const router = require("express").Router();
const router = require("express").Router();
const { body } = require("express-validator");
const productController = require("../controller/admin");

router.post(
  "/",
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
router.get("/", productController.getProductsIdAll);
router.get("/title/:name", productController.getProductsNameTitleAll);
router.get("/category/:name", productController.getProductsNameCategoryAll);
module.exports = router;