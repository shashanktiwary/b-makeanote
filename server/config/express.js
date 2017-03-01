/**
 * Express configuration
 */

'use strict';

var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var cors = require('cors');
var passport = require('passport');
var GoogleTokenStrategy = require('passport-google-id-token');
var User = require('../api/user/user.model');

module.exports = function (app) {
  var env = app.get('env');

  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(cors());
  app.use(passport.initialize());

  passport.use(new GoogleTokenStrategy({
    clientID: "587152662839-vr7o37jcpn6ora2llurkdo07u75ne5vl.apps.googleusercontent.com",
    clientSecret: "aj97pc2EkaAckmE8_mbgyYvt",
    passReqToCallback: true
  },
    function (req, profile, sub, done) {
      User.findOneAndUpdate({ email: profile.payload.email }, { provider: "Google", sub: sub, email: profile.payload.email, name: profile.payload.name }, { upsert: true, new: true }, function (err, user) {
        return done(err, user._doc);
      });
    }
  ));

  if ('production' === env) {
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};