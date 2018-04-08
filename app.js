const express = require('express'),
      path = require('path'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      secure = require('express-force-https');


// hook for database connection
require('./api/api.config');

// route setup for api, back and front
const routesApi = require('./api/api.routes'),
      routesAdmin = require('./admin/admin.routes'),
      routesFront = require('./front/front.routes');

let app = express();

app.listen(process.env.PORT || 3000, function() {
  console.log('Express has started on port 3000');
});

// view directory setup
app.set('views', [`${__dirname}/admin/views`, `${__dirname}/front/views`]);
app.set('view engine', 'pug');

// force https
app.use(secure);

// logging middleware
app.use(logger('dev'));

// parsing middleware for json and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'front/assets')));

// middleware allows for put and delete requests on forms
app.use(methodOverride('_method'));

// route setup
app.use('/api', routesApi);
app.use('/', routesFront);
app.use('/admin', routesAdmin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// finally we export the app module
module.exports = app;