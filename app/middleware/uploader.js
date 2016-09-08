/**
 * Created by sridharrajs on 6/30/16.
 */

'use strict';

let multer = require('multer');

function uploadMiddleWare(req, res, next) {
	return multer({
		storage: multer.diskStorage({
			destination: (req, file, callback) => {
				callback(null, '../../uploads');
			},
			filename: (req, file, callback) => {
				callback(null, `${req.uid}.html`);
			}
		}),
		limits: {
			fields: 1,
			files: 1,
			fileSize: 512000
		}
	}).single('file');
}

module.exports = uploadMiddleWare;