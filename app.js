var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('logger');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');


var db = require('./config/db');
var port = process.env.PORT || 8002;
mongoose.connect(db.url);

var session = require('express-session');
var mongooseSession = require('mongoose-session');

app.use(bodyParser.json());
app.use(bodyParser.json({type : 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser(process.env.COOKIE_SECRET || 'myCookieSecret'));
app.use(session({
	store: mongooseSession(mongoose),
	secret : process.env.COOKIE_SECRET || 'myCookieSecret',
	key:'session',
	cookie : {maxAge : 90000}
}));	
app.use(favicon());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));

require('./app/route')(app);

app.listen(port);
console.log('Listen the port ' + port);
exports= module.exports = app;