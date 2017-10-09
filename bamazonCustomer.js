var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "Musashi3", //Your password
    database: "bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT * FROM products", function(err, results){
    	if (err) throw err;
    	console.log("Here is our current selection of wares: \n")

    	for (i = 0; i < results.length; i++){
    	
    		console.log(JSON.stringify(results[i]) + "\n-------------------------------------------------------");

    	}
    	start();
    })

    
})


function start(){
	inquirer.prompt([
	{
		type: 'input',
		name: 'id',
		message: 'Which item id number would you like to purchase?',
		
	}, 
	{
		type: 'input',
		name: 'stock_qty',
		message: 'How many would you like to purchase?',
		
		
	},
	{
		type: 'confirm',
		name: 'confirm',
		message: "Please confirm your purchase.",
		
	}
	]).then(function(answers){
		//console.log(JSON.stringify(answers))

		if (answers.confirm === true){

			connection.query('SELECT * from products WHERE id =' + answers.id, function(err, results){
				if (err) throw err;
				//console.log(results);
				if(results[0].stock_qty >= answers.stock_qty){
					var updateQty = results[0].stock_qty - answers.stock_qty;
					connection.query('UPDATE products SET stock_qty=' + updateQty + ' WHERE id = ' + answers.id)
					//console.log(results[0].price);
					console.log('\n--------------------------------------------------------------------------\n');
					console.log('Thank you for your transaction.\n')
					console.log('You purchased ' + answers.stock_qty + ' ' + results[0].product_name + " for " +  results[0].price * answers.stock_qty + " USD!");
					console.log('\n--------------------------------------------------------------------------\n');
				}else{
					console.log('\n--------------------------------------------------------------------------\n');
					console.log('We are sorry! There are only ' + results[0].stock_qty + ' units of the '  + results[0].product_name + ' left.');
					console.log('\n--------------------------------------------------------------------------\n');
					start();

				}
			});
		}else{
			console.log('\n--------------------------------------------------------------------------\n');
			console.log('Did you change your mind?')
			console.log('\n--------------------------------------------------------------------------\n');
			start();
		}


	});

}
