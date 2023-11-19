// recursive Function to create a nested category structure

function createCategories(categories, parentid) {
  const categoryList = [];
  let category;
  if (parentid == null) {
    category = categories.filter((cat) => cat.parentid == undefined);
  } else {
    category = categories.filter((cat) => cat.parentid == parentid);
  }

  for (let cate of category) {
    categoryList.push({
      ...cate,
      children: createCategories(categories, cate.id),
    });
  }

  return categoryList;
}

function findCategoryWithId(categoriesWithProductsList, categoryId) {
  // Helper function to recursively search for a category
  function findCategoryRecursive(category, id) {
    if (category.id === id) {
      return category;
    }

    for (const childCategory of category.children) {
      const foundCategory = findCategoryRecursive(childCategory, id);
      if (foundCategory) {
        return foundCategory;
      }
    }

    return null;
  }

  // Search for the category in the list
  for (const category of categoriesWithProductsList) {
    const foundCategory = findCategoryRecursive(category, categoryId);
    if (foundCategory) {
      return foundCategory;
    }
  }

  // Return null if the category with the given ID is not found
  return null;
}

function getImageIdsForCategory(data) {
  const imageIds = [];

  function extractImageIds(category) {
    // Extract the image_public_id of the category itself
    if (category.image_public_id) {
      imageIds.push(category.image_public_id);
    }

    // Extract public_id of products in the category
    for (const product of category.products) {
      if (product.images) {
        for (const image of product.images) {
          if (image.public_id) {
            imageIds.push(image.public_id);
          }
        }
      }
    }

    for (const childCategory of category.children) {
      extractImageIds(childCategory);
    }
  }

  extractImageIds(data);

  return imageIds;
}

export { createCategories, getImageIdsForCategory, findCategoryWithId };
