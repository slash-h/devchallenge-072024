const cds = require("@sap/cds");

module.exports = cds.service.impl(function () {
  function compare(a, b) {
    return a - b;
  }

  this.on("theAnswer", () => 42);

  this.on("highestValue", ({ data }) => {
    //data here is expected to be an array since it is defined that way in the action definition

    //By default the SORT function in Javascript assumes the elements of an array as strings (even if they are numbers),
    //and sort them ascending. Therefore, the numerical sort does not always work correctly.
    //To address this issue (sorting of numerical array), we need to provide a CompareFunction to the SORT function.
    //See details at - https://www.geeksforgeeks.org/javascript-array-sort-method/

    data.sort(compare); //shorter way of doing this is by using an anonymous function - data.sort((a,b) => a - b);
    data.reverse();
    return data[0];
  });
});
