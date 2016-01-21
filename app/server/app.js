/**
 * Created by sridharrajs on 1/6/16.
 */

'use strict';

let bp = require('body-parser');
let cors = require('cors');
let express = require('express');
let compression = require('compression');

let app = express();

app.use(cors());
app.use(compression());
app.use(bp.json());
app.use(bp.urlencoded({
	extended: false
}));

let reqHeaderFilter = require('./middlewares/request-header');
app.use(reqHeaderFilter.setHeaders);

app.use(express.static('./app/client/'));
app.set('view engine', 'ejs');

let authFilter = require('./middlewares/auth-filter');
app.all('/api/*', [authFilter.authenticate]);
app.get('/api', function (req, res) {
	res.status(200).send({
		msg: 'Server is up!'
	});
});

let userRoutes = require('./routes/user-routes');
app.post('/api/users', userRoutes.signup);
app.post('/api/login', userRoutes.loginUser);

let articleRoutes = require('./routes/article-routes');
app
	.get('/api/article', articleRoutes.getArticle)
	.post('/api/article', articleRoutes.addArticle)
	.post('/api/import-pocket', articleRoutes.importFromPocket);

process
	.on('uncaughtException', (err) => {
		console.error(err.stack);
	});

function getApp() {
	return app;
}

module.exports = {
	getApp
};