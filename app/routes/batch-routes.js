/**
 * Created by sridharrajs.
 */

'use strict';

let express = require('express');
let app = express.Router();

let batchController = require('../controllers/batch-controller');

function addAll(req, res) {
	let urls = req.urls;
	batchController.addAll(urls).then(()=> {
		return res.status(200).send({
			msg: 'Success'
		});
	}).catch((err) => {
		return res.status(500).send({
			msg: err
		});
	});
}

app.post('/', addAll);

module.exports = app;