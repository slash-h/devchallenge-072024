const cds = require("@sap/cds");

module.exports = cds.service.impl(function () {
  this.on("productInfo", async ({ data: { id } }) => {
    const db = await cds.connect.to("db");
    const { Products } = db.entities("northwind");

    let queryResult = await SELECT.one
      .from(Products)
      .columns((p) => {
        p.ProductName,
          p.Supplier((s) => {
            s.CompanyName;
          });
      })
      .where({ ProductID: id });

    // console.log(queryResult);
    // console.log(queryResult.ProductName + " by " + queryResult.Supplier.CompanyName);
    return queryResult.ProductName + " by " + queryResult.Supplier.CompanyName;
  });

  //unbound action
  this.on("selectProduct", async (req) => {
    const db = await cds.connect.to("db");
    const { Products } = db.entities("northwind");

    const { data } = req; //get the input data
    const communityid = data.communityid;
    // Convert input community Id into LowerCase and then derive its ASCII decimal value
    const commIdArr = Array.from(communityid.toLowerCase());

    let commIdAsciiVal = 0;
    for (x of commIdArr) {
      commIdAsciiVal += x.charCodeAt(0);
    }

    console.log("Comm ID Ascii Value: " + commIdAsciiVal);

    // determine total number of products in the db
    const totalProducts = await SELECT.one
      .from(Products)
      .columns("count(ProductID) as count");
    console.log("Total Products with alias: " + totalProducts.count);

    const totalProductsNoAlias = await SELECT.one
      .from(Products)
      .columns("count(ProductID)");
    console.log("Total Products No alias: " + totalProductsNoAlias.count);

    // Derive a 'logical' product Id from community id by taking Mod
    const commIdProductId = (commIdAsciiVal % totalProducts.count) + 1;

    console.log("Comm Id Prod id: " + commIdProductId);
    //Select the relevant product
    const result = await SELECT.one
      .from(Products)
      .columns("ProductName")
      .where({ ProductID: commIdProductId });

    console.log(result);

    return result.ProductName;
  });

  //bound function
  this.on(
    "stockValue",
    "Products",
    async ({ params: [{ ProductID: productId }] }) => {
      const db = await cds.connect.to("db");
      const { Products } = db.entities("northwind");

      //    const productId = req.params[0].ProductID;

      const result = await SELECT.one
        .from(Products)
        .columns("UnitPrice * UnitsInStock as stockVal")
        .where({ ProductID: productId });

      return result.stockVal;
    },
  );
});
