//MAPD713 Enterprise Technologies for mobile platforms
// Mankiran kaur - 29/09/2017

//load modules
var SERVER_NAME = 'user-api'
var PORT = 3000;
var HOST = '127.0.0.1';
var http = require('http');
var url = require('url');

//setting counters
var postcounter = 0;
var getcounter = 0;


var restify = require('restify')

  // Get a persistence engine for the users
  , productsSave = require('save')('products')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server is listening at - http://'+ HOST + ":" +PORT)
  console.log('Endpoints: http://'+ HOST + ':' + PORT + '/sendGet method:GET'  );
  console.log('Endpoints: http://'+ HOST + ':' + PORT + '/sendPost  method:POSt' );
  console.log('Resources:')
  console.log(' /products')
  console.log(' /products/:id')  
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())


//---------------------------Get all products ------------------------//
server.get('/sendGet', function (req, res, next) {

  console.log('>sendGet: received request');
  console.log("Processed Request Count" + ++getcounter);
  // Find every entity within the given collection
  productsSave.find({}, function (error, products) {
    
    // Return all of the users in the system
    res.send(products)
  })
})


//------------------ Getting a single product by their user id -------------------//
server.get('/sendGet/:id', function (req, res, next) {

  // Find a single user by their id within save
  productsSave.findOne({ _id: req.params.id }, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (product) {
      // Send the user if no issues
      res.send(product)
    } else {
      // Send 404 header if the user doesn't exist
      res.send(404)
    }
  })
})


//------------------------Creating a new product --------------------------------//
server.post('/sendPost', function (req, res, next) {
  //request counter showing on the console
  console.log('<sendPost: sending response');
  console.log("Processed post request count" +  ++postcounter);

  // Make sure name is defined
  if (req.params.product === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('age must be supplied'))
  }
  var newproduct = {
		product: req.params.product, 
		price: req.params.price
	}


  // Create the user using the persistence engine
  productsSave.create( newproduct, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the user if no issues
    res.send(201, product)
  })
})


// -------------Delete products with the given id-------------//
server.del('/sendDelete/:id', function (req, res, next) {

  // Delete the user with the persistence engine
  productsSave.delete(req.params.id, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})


//----------------deleting all users-------------------//
server.del('/senddelete', function (req, res, next) {
  
     // reset the given collection
     productsSave = require('save')('products')
  
     // Send a 200 OK response
     res.send("All records deleted.");
 })


