module.exports = function objLength(obj) {
  let length = 0;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      length += 1;
    }
  }
  return length;
};
