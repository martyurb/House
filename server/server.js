require('dotenv').config()
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var winston = require('winston'),
    expressWinston = require('express-winston'); // unusual indentation from library docs


// create express server
var app = express();

// set ENV variables to be accessible within the app
app.set('clientId', process.env.CLIENT_ID);
app.set('clientSecret', process.env.CLIENT_SECRET);
app.set('port', process.env.PORT || 4000); // if no port is specified default to 4000

app.use(cors()); // enable CORS
app.use(bodyParser.json()); // use body parser to turn encoded request data into a JS object

// setup winston express logging
app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: false, // disabling metadata logging for security as it includes headers which contain Authorization tokens
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
  }));

// Add routes to middleware chain
const userRouter = require("./routes/user");

// Mount routes
app.use("/user", userRouter);

// bind express app to port and listen for connections
app.listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port'));
});