/*A JavaScript module  which outputs a boolean based on whether the inpout is prime  */

const isPrime = (n = null) => {
  if (n === null) {
    return null;
  }
  if (n < 2) {
    return false;
  }
  for (let i = 2; i < Math.sqrt(n); ++i) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
};
module.exports = isPrime;
