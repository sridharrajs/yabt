/**
 * Created by sridharrajs.
 */

'use strict';

let chalk = require('chalk');

let config = require('./config');
let bootSequence = require('./bin/boot-sequence');

bootSequence.load().then((info)=> {
	console.log('Establishing DB connection ', chalk.blue(info));
	let appServer = require('./app/boot/build-server');
	return appServer.start(config);
}).then((info)=> {
	console.log(`Starting Server at ${chalk.green(config.port)}`, chalk.blue(info));
}).catch((error)=> {
	console.log(chalk.red(error.stack));
	process.exit(0);
});

process.on('uncaughtException', (err) => {
	console.error(err.stack);
});
