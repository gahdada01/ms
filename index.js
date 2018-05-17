var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');
var app = express();
var db = process.env.DB_ENV || 'gms';
var PORT = 3000;
var HOST = 'localhost';

// ES6 Promise
mongoose.Promise = global.Promise;

// CONNECTION EVENTS
mongoose.connection.on('connected', () => {
  // When successfully connected
  console.log('Connected to ' + db + ' DB ..');
}).on('disconnected', () => {
  // When the connection is disconnected
  console.log('Connection disconnected!');
  //next(new Error("Connection disconnected!"));
}).on('reconnected', () => {
  // When the connection is reconnected
  console.log('Connection reconnected!');
}).on('error', (err) => {
  // If the connection throws an error
  console.log('Connection error : ' + err);
  mongoose.disconnect();
});

// If the Node process ends, close the Mongoose connection 
var gracefulExit = () => {
  mongoose.connection.close( () => {
    console.log('Connection disconnected through app termination');
    process.exit(0);
  });
}
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

// Set CORS ORIGIN HEADERS
app.use(cors({
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
}));

// Set CORS ORIGIN HEADERS
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*'); // * => allow all origins
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Accept, Range');
  res.header('Access-Control-Expose-Headers','Accept-Ranges, Content-Encoding, Content-Length, Content-Range');
  // res.header('Access-Control-Allow-Credentials', true);
  next();
});


//app.use(bodyParser.json());
// app.use(bodyParser.json({limit: '10mb'}));
// app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
// app.use(express.static(path.join(__dirname, 'public/')));

// Models
// Test = require('./models/test');

// require file
var qrcode = require('./routes/qrcode');

// Apis
app.use('/api/genqrcode', qrcode);

app.listen(PORT, (err) => {
  err ?  console.log("Error connecting to port" + PORT)
      :  console.log('Running on port ' + PORT + '...');
});

// http.createServer(app).listen(8080);
// https.createServer(options, app).listen(10443);

//error handler
app.use( (err, req, res, next) => {
  res.json({'data': err.message, 'success': false});
});
