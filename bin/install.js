/**
 * Created by sridharrajs on 7/7/16.
 */

'use strict';

const bcrypt = require('bcrypt-as-promised');
let chalk = require('chalk');

let bootSequence = require('./boot-sequence');

const DEFAULT_EMAIL = 'admin@admin.com';
const DEFAULT_PASSWORD = 'admin';

const EMAIL = 'admin@admin.com';
const PASSWORD = 'admin';

isDefaultsUnchanged().then(()=> {
	return bootSequence.load();
}).then(()=> {
	return bcrypt.hash(PASSWORD);
}).then((hashedPassword)=> {
	let userController = require('../app/controllers/user-controller');
	return userController.createAdmin({
		email: EMAIL,
		password: hashedPassword
	});
}).then(()=> {
	console.log(chalk.blue('Admin created'));
	process.exit(0);
}).catch((err) => {
	console.log('Installation failed', chalk.red(err));
	process.exit(0);
});

function isDefaultsUnchanged() {
	if (EMAIL === DEFAULT_EMAIL) {
		return Promise.reject('Default email is unchanged');
	}
	if (PASSWORD === DEFAULT_PASSWORD) {
		return Promise.reject('Default password is unchanged');
	}
	return Promise.resolve();
}