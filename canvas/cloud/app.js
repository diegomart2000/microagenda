// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'jade');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

//Main application entry point
app.get('/facebook/canvas', function(req, res) {
  res.render('hello');
});

app.post('/facebook/canvas', function(req, res) {
  res.render('hello');
});

//Application partials
app.get('/partials/:name', function(req, res) {
  res.render('partials/' + req.params.name);
});

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});




app.listen();