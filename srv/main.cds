using {northwind} from '../db/schema';

//@path: '/northbreeze'
service northbreeze {
  //Task 7 - northbreeze service
  @cds.redirection.target: true
  entity Products      as projection on northwind.Products
    actions {
      function stockValue() returns Integer
    };

  entity Suppliers     as projection on northwind.Suppliers;
  entity Categories    as projection on northwind.Categories;

  //Task 10 - 'as select from' variant
  entity TotalProducts as
    select from northwind.Products {
      count(ProductID) as count : Integer
    };

  //Task 7 - unbound function
  function productInfo(id : Integer)           returns String;
  //Task 9 - unbound action
  action   selectProduct(communityid : String) returns String;
}
