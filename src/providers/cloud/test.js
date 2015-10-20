var _ = require('lodash');


function temp() {
  this.name = "test"
}


_.extend(temp.prototype, {
  log: function () {
    console.log(this.name)
  }
});


var a = new temp;
a.log();