/**
 * Created by sridharrajs on 7/7/16.
 */

'use strict';

const bcrypt = require('bcrypt-as-promised');
let chalk = require('chalk');

let bootSequence = require('./boot-sequence');

const EMAIL = 'admin@admin.com';
const PASSWORD = 'admin';

bootSequence.load().then(()=> {
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