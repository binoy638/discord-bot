const extractIDIndex = (embed) => {
  if (!embed) return undefined;
  const footerText = embed?.footer?.text;
  if (!footerText) return undefined;

  const strArr = footerText.split(" ");

  const ID = strArr[strArr.indexOf("ID:") + 1];
  const Index = strArr[strArr.indexOf("Index:") + 1];

  if (!ID || !Index) return undefined;

  return [ID, Index];
};

module.exports = { extractIDIndex };
