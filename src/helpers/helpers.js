export const extractObjectKeys = (object) => {
  let objectKeysArr = [];
  Object.keys(object).forEach((objectKey) => {
    const value = object[objectKey];
    if (typeof value !== "object") {
      objectKeysArr.push(objectKey);
    } else {
      objectKeysArr = [...objectKeysArr, ...extractObjectKeys(value)];
    }
  });
  return objectKeysArr;
};

export const sortingDirectionsTypes = {
  ASCENDING: "ASCENDING",
  DESCENDING: "DESCENDING",
  UNSORTED: "UNSORTED",
};
