/**
 * Created by sridharrajs on 1/6/16.
 */

'use strict';

let bp = require('body-parser');
let compression = require('compression');
let cors = require('cors');
let express = require('express');
let helmet = require('helmet');

let app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bp.json());
app.use(bp.urlencoded({
	extended: false
}));

let reqHeaderFilter = require('./middleware/request-header');
app.use(reqHeaderFilter);

app.use(express.static('./dist'));
app.set('view engine', 'ejs');

let authFilter = require('./middleware/auth-filter');
app.all('/api/*', [authFilter]);

let indexRoutes = require('./routes/index-routes');
app.use('/api', indexRoutes);

let lastLogin = require('./middleware/last-login');
let userRoutes = require('./routes/user-routes');
app.use('/api/users', [lastLogin], userRoutes);

let articleRoutes = require('./routes/article-routes');
app.use('/api/articles', articleRoutes);

module.exports = app;