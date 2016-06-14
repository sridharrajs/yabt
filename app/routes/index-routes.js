/**
 * Created by sridharrajs.
 */

'use strict';

let express = require('express');
let app = express.Router();

function printStatus(req, res) {
	return res.status(200).send({
		msg: 'Server is up!'
	});
}

app.get('/', printStatus);

module.exports = app;