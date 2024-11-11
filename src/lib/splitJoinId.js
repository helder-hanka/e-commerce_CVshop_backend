module.exports = function splitJoinId(id) {
  const arraId = [];
  let a = "";
  let count = 0;
  for (let i = 0; i < id.length; i++) {
    count++;
    a += id[i];
    if (count === 4) {
      arraId.push(a);
      (a = ""), (count = 0);
    }
  }
  return arraId.join("-").toUpperCase();
};
