var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "Musashi3", //Your password
    database: "bamazon"
})

connection.connect(function(err){
	if (err) throw err;
	managerOption();
});

var managerOption = function(){
	inquirer.prompt([
	{
		type: 'list',
		name: 'action',
		message: 'What would you like to do?',
		choices: [
		'View Products for Sale',
		'View Low Inventory',
		'Add to Inventory',
		'Add New Product'
		]
	}

		]).then(function(answer){
			//console.log(answer.action);
			switch (answer.action) {
				case 'View Products for Sale':
					viewProducts();
					break;
				case 'View Low Inventory':
					viewLowInventory();
					break;
				case 'Add to Inventory':
					addInventory();
					break;
				case 'Add New Product':
					newProduct();
					break;
			}
		});
};

var viewProducts = function(){

    connection.query("SELECT * FROM products", function(err, results){
    	if (err) throw err;
    	console.log('\n Here is a view of all current products: \n')
    	for (i = 0; i < results.length; i++){
    	
    		console.log(JSON.stringify(results[i]) + "\n-------------------------------------------------------");

    	}

    	managerOption();


    });

};

var viewLowInventory = function(){
	connection.query('SELECT * FROM products WHERE stock_qty < 2', function(err, results){
		if (err) throw err;

		for (i = 0; i < results.length; i++){
    	
    		console.log(JSON.stringify(results[i]) + "\n-------------------------------------------------------");

    	}

    	if (results.length === 0){
    		console.log('\nAll products have sufficient stock levels.\n')
    	}

    	managerOption();

	});
};

var addInventory = function(){

	    connection.query("SELECT * FROM products", function(err, results){
    	if (err) throw err;
    	console.log('\n Here is a view of all current products: \n')
    	for (i = 0; i < results.length; i++){
    	
    		console.log(JSON.stringify(results[i]) + "\n-------------------------------------------------------");

    	}



	inquirer.prompt([
	{
		name: 'id',
		type: 'input',
		message: 'Enter product ID that you would like to add stock to: '
	},
	{
		name: 'stockAdd',
		type: 'input',
		message: 'How many units would you like to add?'
	}


		]).then(function(answer){
			connection.query('SELECT * FROM products', function(err, results){

				var productSel;

				for (var i = 0; i < results.length; i++){
					if (results[i].id === parseInt(answer.id)){
						productSel = results[i];
					}
				}

				var updatedStock = parseInt(productSel.stock_qty) + parseInt(answer.stockAdd);

				console.log('\n' + productSel.product_name + ' stock levels have been updated to ' + updatedStock + ' units.\n');

				managerOption();

				connection.query('UPDATE products SET ? WHERE ?', [{
					stock_qty: updatedStock}, {
						id: answer.id}]), function(err, results){
					if (err) throw err;
				}

			});
		});
	});

};


var newProduct = function(){
	inquirer.prompt([{
		name: 'product_name',
		type: 'input',
		message: 'What is the product you would like to add?'
	}, {
		name: 'department_name',
		type: 'input',
		message: 'What is the department for this product?'
	}, {
		name: 'price',
		type: 'input',
		message: "What is the products price?"
	}, {
		name: 'stock_qty',
		type: "input",
		message: "How many units would you like to stock?"
	}]).then(function(answer){
		connection.query("INSERT INTO products SET ?", {
			product_name: answer.product_name,
			department_name: answer.department_name,
			price: answer.price,
			stock_qty: answer.stock_qty
		}, function(err, resuts){
			if (err) throw err;
			console.log('\nYour product has been successfully added to products table!\n');
			managerOption();
		});
	});
}

