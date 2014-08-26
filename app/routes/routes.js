'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
    security       = require('../lib/security'),
    less           = require('less-middleware'),
    home           = require('../controllers/home'),
    addresses      = require('../controllers/addresses'),
    users          = require('../controllers/users');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());
  app.use(session({store:new RedisStore(), secret:'keyboard cat', resave:true, saveUnitilialized:true, cookie:{maxAge:null}}));
  app.use(security.authenticate);

  app.get('/', home.index);

  app.get('/register', users.new);
  app.post('/register', users.create);

  app.get('/login', users.login);
  app.post('/login', users.authenticate);

  app.use(security.bounce);

  app.delete('/logout', users.logout);
  app.get('/addresses', addresses.index);
  app.get('/addresses/new', addresses.new);
  app.post('/addresses', addresses.create);

  console.log('Express: Routes Loaded');
};

