module.exports = calculatePercentage = (percentage, price) => {
  return Math.floor((price / 100) * percentage);
};
