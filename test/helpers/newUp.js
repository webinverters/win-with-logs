/**
 *
 * @param func class or factory constructor
 * @param args array of arguments
 * @returns {*} return a new instance of the class.
 */
function newUp(func, args) {
  var temp = function () {
  };
  temp.prototype = func.prototype;
  var child = new temp;
  var result = func.apply(child, args);
  return child;
  return typeof result === "object" ? result : child;
}

module.exports = newUp;