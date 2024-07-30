const cds = require("@sap/cds");

module.exports = cds.service.impl(function () {
  this.on("ping", () => "pong");

  this.on("hello", ({ data: { to } }) => "Hello " + to + "!");

  this.on("sum", ({ data: { a, b } }) => a + b);
});
