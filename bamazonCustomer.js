var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazondb"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  
});
var itemNos = [];
var quantityInput = 0;
var itemNumber = 0;
var itemPrice = 0;

productList();
function productList() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      itemNos.push(res[i].item_id);
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
   
    console.log(itemNos);
    // console.log(res);
    // connection.end();
    selectProduct();
  });
}

function selectProduct() {
  inquirer.prompt({
      name: "itemId",
      type: "input",
      message: "Please enter item number.",
      validate: function(value) {
          if (!isNaN(value)) {
            return true;
          }
          return false;
        }    
    })
    .then(function(answer) {
    // based on their answer, store the item number in itemNumber 
      itemNumber = parseInt(answer.itemId);
     
        if (itemNos.indexOf(itemNumber) < 0) {
          console.log("Not a valid item number.");
          
          selectProduct();
        }else{
         console.log(itemNumber);
         selectQuantity();
        }    
    });
}
function selectQuantity(){
  inquirer.prompt({
      name: "quantity",
      type: "input",
      message: "Please enter quantity.",
      validate: function(value) {
          if (!isNaN(value)) {
            return true;
          }
          return false;
        }    
    })
    .then(function(answer) {
      quantityInput = parseInt(answer.quantity);
      // console.log(parseInt(answer.quantity));
      console.log("How many?: " + quantityInput);
      checkStock();
})
}
function checkStock(){
  var query = "SELECT * FROM products WHERE ?";connection.query(query, {item_id: itemNumber}, function(err, res) {
    if (err) throw err;
    // console.log(res[0].stock_quantity);
    var currentStock = res[0].stock_quantity;
    
    if (currentStock < quantityInput) {
      console.log("Insufficient quantity in stock!");
      return;
    }else{
      var stock = res[0].stock_quantity - quantityInput;
      // console.log("the remaing stock" + stock);
      itemPrice = res[0].price;
      console.log("Total cost is:  $" + (itemPrice * quantityInput));
    }
    connection.query(
          "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: stock
              },
              {
                item_id: itemNumber
              }
             ],
            function(error) {
              if (error) throw err;
             
            }
      );
  });
}
