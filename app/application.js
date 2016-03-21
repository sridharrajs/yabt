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

let reqHeaderFilter = require('./middlewares/request-header');
app.use(reqHeaderFilter.setHeaders);

app.use(express.static('./public'));
app.set('view engine', 'ejs');

let authFilter = require('./middlewares/auth-filter');
app.all('/api/*', [authFilter.authenticate]);

let indexRoutes = require('./routes/index-routes');
app.use('/api', indexRoutes);

let userRoutes = require('./routes/user-routes');
app.use('/api/users', userRoutes);

let articleRoutes = require('./routes/article-routes');
app.use('/api/articles', articleRoutes);

module.exports = {
	app
};