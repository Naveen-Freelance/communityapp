// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');


var fs = require('fs');

// configure app
app.use(morgan('dev')); // log requests to the console

var database = require('./config/database');

var imgPath = '/Users/Travelog/Naveen/Personal/Naveen-Professional.jpg';
var aadhar_card_image_path = '/Users/Travelog/Naveen/Personal/Naveen-Professional.jpg';
var business_card_image_path = '/Users/Travelog/Naveen/Personal/Naveen-Professional.jpg';

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/Iganiq8o'); // connect to our database
// configuration ===============================================================
mongoose.connect(database.localUrl); 	// Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
var Bear     = require('./app/models/bear');

/*User Model*/
var User = require('./app/models/user/registration');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Below is the api call for your request.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to Community App Api Portal!' });	
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')

	// create a bear (accessed at POST http://localhost:8080/bears)
	.post(function(req, res) {
		
		var bear = new Bear();		// create a new instance of the Bear model
		bear.name = req.body.name;  // set the bears name (comes from the request)

		bear.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Bear created!' });
		});

		
	})

	// get all the bears (accessed at GET http://localhost:8080/api/bears)
	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err)
				res.send(err);

			res.json(bears);
		});
	});

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

	// get the bear with that id
	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err)
				res.send(err);
			res.json(bear);
		});
	})

	// update the bear with this id
	.put(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {

			if (err)
				res.send(err);

			bear.name = req.body.name;
			bear.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Bear updated!' });
			});

		});
	})

	// delete the bear with this id
	.delete(function(req, res) {
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// User Routes
router.route('/register')

	.post(function(req,res){
		var userRegistration = new User();
		userRegistration.user_name = req.body.user_name;
		userRegistration.bussiness_type = req.body.bussiness_type;
		userRegistration.mobile_number = req.body.mobile_number;
		userRegistration.email = req.body.email;
		userRegistration.address = req.body.address;
		userRegistration.business_card.data = fs.readFileSync(business_card_image_path);
		userRegistration.aadhar_card.data = fs.readFileSync(aadhar_card_image_path);
		userRegistration.business_card.contentType = 'image/jpg';
		userRegistration.aadhar_card.contentType = 'image/jpg';
		userRegistration.save(function(err){
			if(err){
				var errors = err.errors;
				if(err.name == "ValidationError"){
					if(errors.user_name){
						res.json({
							message:'User Name Field is required',
							reasonCode:400,
							errorMessage:'Bad Request'
						});
					}
				} else if(err.name == "ValidationError"){
					if(errors.bussiness_type){
						res.json({
							message:'Nature of business type field is required',
							reasonCode:400,
							errorMessage:'Bad Request'
						});
					}
				} else if(err.name == "ValidationError"){
					if(errors.mobile_number){
						res.json({
							message:'Nature of business type field is required',
							reasonCode:400,
							errorMessage:'Bad Request'
						});
					}
				} if(err.name == "ValidationError"){
					if(errors.email){
						res.json({
							message:'Email field is required',
							reasonCode:400,
							errorMessage:'Bad Request'
						});
					}
				} if(err.name == "ValidationError"){
					if(errors.address){
						res.json({
							message:'Address field is required',
							reasonCode:400,
							errorMessage:'Bad Request'
						});
					}
				} else {
					res.send(err);
				}
			} else {
				res.json({message:'User Registration Successful'});
			}
		});
	});

router.route('/users')

	.get(function(req,res){
		User.find(function(err,users){
			if(err)
				res.send(err);

			res.json(users)
		})
	});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
