var express = require('express');
var app = express();

// const for yelp fusion

'use strict';

const yelp = require('yelp-fusion');


app.set('port', (process.env.PORT || 5000));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);



app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



// yelp search 

app.get('/yelp', (request, response) => {


	yelp.accessToken("Wcf4F0e2J9nLBO4EyclzlA", "Hitr46oApK4kOmwPghBKjID5mWQOpZ5daCTNR9qGHtZOvkWypXPJYARho5h7lShJ").then(data => {
		console.log(data.jsonBody.access_token);
			// var searchTerm = request.query.id.q;
			console.log(request.query)
			const { q , location } = request.query;
			console.log(q)
			const client = yelp.client(data.jsonBody.access_token);

		client.search({
			term: q,
			location, 

		}).then(results => {
			console.log(results.jsonBody.businesses[0].name);
			response.send(results)
		});
	}).catch(e => {
	  console.log(e);
	  response.sendStatus(404)
	});



});
