function addOrderProgress(product) {
  const orderItem = product;
  if (typeof orderItem != "object") {
    return null;
  }

  orderItem.forEach((value) => {
    delete value.Admin;
  });

  const ListAdminIdOrder = [
    ...new Set(orderItem.map((value) => value.admin)).values(),
  ];

  const hashmapAdminOrder = new Map();

  for (let i = 0; i < ListAdminIdOrder.length; i++) {
    const orders = orderItem.filter(
      (value) => value.admin == ListAdminIdOrder[i]
    );

    hashmapAdminOrder.set(ListAdminIdOrder[i], orders);
  }
  let newResult = [];

  hashmapAdminOrder.forEach((value, key) => {
    const reduced = value.reduce(
      (r, { price, quantity }) => {
        r["quantityTotal"] += quantity;
        r["priceTotal"] += price * quantity;
        return r;
      },
      { quantityTotal: 0, priceTotal: 0, admin: key }
    );
    reduced["products"] = value;

    newResult.push(reduced);
  });

  return newResult;
}
