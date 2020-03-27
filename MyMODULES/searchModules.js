/*A JavaScript Module which perform a linear search for a given value inside an array. if the specified value is found, the index of the element in the array with that value is returend. 
If the specified value is not found in the array null is returned*/

const linearSearch = (array, value) => {
  let output = null;
  //if value or array is object then convert it to string
  if (typeof value === "object") {
    value = JSON.stringify(value);
    for (let i = 0; i < array.length; i++) {
      if (typeof array[i] === "object") array[i] = JSON.stringify(array[i]);
    }
  }
  //if value is function convert it to string then use it
  if (typeof value === "function") {
    value = "" + value;
    for (let i = 0; i < array.length; i++) {
      if (typeof array[i] === "function") {
        array[i] = "" + array[i];
      }
    }
  }
  //when value matched retuen that index on which it is matched
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      output = i;
      return output;
    }
  }
};
module.exports = linearSearch;
