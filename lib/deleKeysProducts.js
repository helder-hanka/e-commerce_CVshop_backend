module.exports = deleteKeysProducts = (ArrayProduct) => {
  const producstId = ArrayProduct[0].products.map((el) => {
    delete el.title,
      delete el.imageUrl,
      delete el.description,
      delete el.category,
      delete el.admin;
    delete el._id;
    return el;
  });
  ArrayProduct.forEach((el) => delete el.products);
  ArrayProduct.push(producstId);
  return ArrayProduct;
};
