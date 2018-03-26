
const express 	= require('express')
const bodyParser= require('body-parser')
var mongoose  	= require('mongoose')
mongoose.connect("mongodb://localhost:27017/myfirstproject");
var db 			= mongoose.connection;
const app 	  	= express()

app.use(bodyParser.urlencoded({extended: true}))
app.listen(3000, function() {
		mongoosastic = require('mongoosastic')
	  , Schema       = mongoose.Schema
	  , ObjectId = Schema.ObjectId
	 
	var QuoteSchema = new Schema({ // creating schema
	    name: {type : String, es_indexed:true }
	  , quote: String
	})
	//QuoteSchema.index({name: 'text'});
	QuoteSchema.plugin(mongoosastic/*, {indexAutomatically: false}*/)
	var Quote = mongoose.model('Quote', QuoteSchema);
	
	app.post('/quotes', (req, res) => {
	    	//============ to store arbitrary record =======start
   	  	   /*for(var i = 0; i <=10000; i++) {
	   	  	  var casual = require('casual');
	   	  	  var obj = {name: casual.name, quote: casual.sentence};
		   	  quote = new Quote(obj);
		   	  quote.save(function(err){
			      if(err){
			           console.log(err);
			           return;
			      }
			  });
	 	   }*/
	 	  
	 	   for(var i=0; i<=10000; i++){
	 	   	 quote = new Quote(req.body);
			   	quote.save(function(err){
		 	   	if(err){
				           console.log(err);
				           return;
				      }
		 	   })
		   }
	 	res.redirect('/?page='+req.body.next_page)	  	
	})
	app.get('/search', (req, res) => {
		Quote.search(
		  {query_string: {query: '*'+req.query.name+'*'}},
		  {hydrate: true},
		  function(err, results) {
		  	res.render('search.ejs', {quotes: results.hits.hits})
		  });
		/*Quote.find({$text:{$search: req.query.name}}).limit(50).exec((err, result) => {
			res.render('search.ejs', {quotes: result})
		})*/
	})
	app.get('/create_index', (req, res) => {
		// to index data
		stream = Quote.synchronize()
		  , count = 0;
		stream.on('data', function(err, doc){
			  count++;
		});
		stream.on('close', function(){
			  console.log('indexed ' + count + ' documents!');
		});
		stream.on('error', function(err){
			  console.log(err);
		});
	});
	app.get('/remove_index', (req, res) => {
		//to remove index
		Quote.remove(function(err, success) {
		  console.log("I've been removed from the cluster :(");
		});
	});
	app.get('/', (req, res) => {
	
	var pagination = require('pagination');
	
	Quote.count((err, count) => {
		    if (err) return console.log(err)
		 
		    var limit 	= 10;
		    var offset 	= ((req.query.page ? req.query.page : 1) - 1)  * limit;
		    var page 	= req.query.page ? req.query.page : 1;
		    Quote.find({}).skip(offset).limit(limit).exec((err, result) => {
		    	if (err) return console.log(err)
		    	var paginator = pagination.create('search', {prelink:'/', current: page, rowsPerPage: limit, totalResult: count});
		    	var ceil = require( 'math-ceil' );
		    	if( count % limit>0){
		  			var last_page = ceil(count / limit);
				}else {
					var last_page = ceil(count / limit) + 1;
				}
				console.log(count);
		    	 // renders index.ejs 
		 		res.render('index.ejs', {quotes: result, pagination:paginator, next_page: last_page })
		    });
		})
	})
	app.get('/view_quote/:id', (req, res) => {
				Quote.findOne({'_id': mongoose.Types.ObjectId(req.params.id)},function(err, result) {
				    res.render('view.ejs', {quote: result})
				});
	})
	app.get('/delete_quote/:id', (req, res) => {
				Quote.remove({'_id': mongoose.Types.ObjectId(req.params.id)},function(err, result) {
				    res.redirect('/')
				});
	})
	app.get('/edit_quote/:id', (req, res) => {
				Quote.findOne({'_id': mongoose.Types.ObjectId(req.params.id)},function(err, result) {
				    res.render('edit.ejs', {quote: result})
				});
	})
	app.post('/update_quote/:id', (req, res) => {
			  	Quote.update({"_id": mongoose.Types.ObjectId(req.params.id)}, {$set:{'name':req.body.name, 'quote':req.body.quote}},function(err, result){
			    if (err) return console.log(err)

			    console.log('saved to database')
			    res.redirect('/')
		})
		  
	})
})
