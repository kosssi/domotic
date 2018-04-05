var connect = require('connect');
var http = require('http');
var Gpio = require('onoff').Gpio;

var boiler = new Gpio(15, 'out');

var app = connect();

// gzip/deflate outgoing responses
var compression = require('compression');
app.use(compression());

// store session state in browser cookie
var cookieSession = require('cookie-session');
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.use('/on', function fooMiddleware(req, res, next) {
  res.end('On!\n');
  boiler.writeSync(0);
  // req.url starts with "/foo"
  next();
});

app.use('/off', function barMiddleware(req, res, next) {
  res.end('Off!\n');
  boiler.writeSync(1);
  // req.url starts with "/bar"
  next();
});

// respond to all requests
app.use(function(req, res){
  res.end('Hello from Connect!\n');
});

//create node.js http server and listen on port
http.createServer(app).listen(3000);
