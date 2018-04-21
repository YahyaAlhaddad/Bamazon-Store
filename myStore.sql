DROP DATABASE IF EXISTS bamazonDb;
CREATE DATABASE bamazonDb;
USE bamazonDb;

CREATE TABLE products (
  item_id INTEGER(15) NOT NULL,
  product_name VARCHAR(30),
  department_name VARCHAR(30),
  price DECIMAL(9,2),
  stock_quantity INTEGER(9),
  PRIMARY KEY (item_id)
);