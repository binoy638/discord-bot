module.exports = (arr, page, size) => {
  const startIndex = page - 1;

  const newarr = arr.slice(size * startIndex, size * page);
  return newarr;
};
