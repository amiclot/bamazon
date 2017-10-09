use bamazon;

create table products(
id INTEGER(11) auto_increment not null,
product_name varchar(20),
department_name varchar(20),
price INTEGER(10),
stock_qty INTEGER(10),
primary key (id)
)

INSERT INTO products(product_name, department_name, price, stock_qty)
VALUES ("NMD", "sneakers", 30, 6);



select * from products;