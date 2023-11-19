function mapArrayByField(
  sourceArray,
  targetArray,
  targetField,
  ...fieldsToPush
) {
  const productMap = new Map();

  // Populate the map with sourceArray data
  sourceArray.forEach((elem) => {
    if (!productMap[elem.productId]) {
      productMap[elem.productId] = [];
    }

    const mappedElem = {};

    // Copy only the specified fields from elem
    fieldsToPush.forEach((field) => {
      if (elem[field] !== undefined) {
        mappedElem[field] = elem[field];
      }
    });
    productMap[elem.productId].push(mappedElem);
  });

  // Update the targetArray data with the mapped data
  targetArray.forEach((product) => {
    const { id } = product;
    if (productMap[id]) {
      product[targetField] = productMap[id];
    } else {
      product[targetField] = [];
    }
  });
}

export { mapArrayByField };
