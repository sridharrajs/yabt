/**
 * Created by sridharrajs on 6/30/16.
 */

let multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './uploads');
	},
	filename: (req, file, callback) => {
		callback(null, `${req.uid}.html`);
	}
});

let upload = multer({
	storage: storage,
	limits: {
		fields: 1,
		files: 1,
		fileSize: 512000
	}
}).single('file');

function uploadMiddleWare(req, res, next) {
	return upload(req, res, next);
}

module.exports = uploadMiddleWare;