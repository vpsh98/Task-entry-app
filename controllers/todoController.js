let bodyParser = require('body-parser');
let mongoose = require('mongoose');

//connect to the db
const dbURI = 'mongodb+srv://vipul:test@todo-app.9la6n.mongodb.net/todo-app?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true});


//create a schema
let todoSchema = new mongoose.Schema({
	item : String
});

//creating a model on above schema
let Todo = mongoose.model('Todo', todoSchema);


let data = [{item: 'Buy groceries'},
	{item: 'meditate'},
	{item: 'Go for a walk'},
];

//get the data in the request body 
let urlencodedParser = bodyParser.urlencoded({ extended : false});
   
module.exports = (app) => {

	app.get('/todo', (req, res) => {
		// get data from mongodb and pass it to the view 
		Todo.find({}, (err, data) => {
			if(err) throw err;
			res.render('todo.ejs', {todos: data});
		})

		
	});

	app.post('/todo', urlencodedParser, (req, res) => {
		//get data from the view and add it 
		// to mongodb
		let newTodo = Todo(req.body).save((err, data)=> {
			if(err) throw err;
			res.json(data);
		})
 	
	});

	app.delete('/todo/:item', (req, res) => {
		//delete the requested item from mongodb
		Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove((err, data) => {
			if(err) throw err;
			res.json(data);
		})
	});

}