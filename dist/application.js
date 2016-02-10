/**
 * Created by sridharrajs on 1/6/16.
 */

'use strict';

var bp = require('body-parser');
var compression = require('compression');
var cors = require('cors');
var express = require('express');
var helmet = require('helmet');

var app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bp.json());
app.use(bp.urlencoded({
	extended: false
}));

var reqHeaderFilter = require('./middlewares/request-header');
app.use(reqHeaderFilter.setHeaders);

app.use(express.static('./public'));
app.set('view engine', 'ejs');

var authFilter = require('./middlewares/auth-filter');
app.all('/api/*', [authFilter.authenticate]);

var indexRoutes = require('./routes/index-routes');
app.use('/api', indexRoutes);

var userRoutes = require('./routes/user-routes');
app.use('/api/users', userRoutes);

var articleRoutes = require('./routes/article-routes');
app.use('/api/articles', articleRoutes);

function getApp() {
	return app;
}

module.exports = {
	getApp: getApp
};