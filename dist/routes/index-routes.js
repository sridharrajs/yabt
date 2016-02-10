/**
 * Created by sridharrajs.
 */

'use strict';

var express = require('express');
var app = express.Router();

app.get('/', function (req, res) {
	res.status(200).send({
		msg: 'Server is up!'
	});
});

module.exports = app;