/**
 * Created by sridharrajs.
 */

'use strict';

let chalk = require('chalk');

let config = require('./config');
let models = require('./app/server/models');

const HOST_ENVIRONMENT = process.env.NODE_ENV;
const MY_SECRET = process.env.MY_SECRET;

config
	.isValidEnv(HOST_ENVIRONMENT)
	.then((info)=> {
		console.log('Checking Environment ', chalk.blue(info));
		return config.isSecretSet(MY_SECRET);
	})
	.then((info)=> {
		console.log('Checking tokens ', chalk.blue(info));
		return config.init(HOST_ENVIRONMENT);
	})
	.then((info)=> {
		console.log('Initializing settings ', chalk.blue(info));
		return models.init();
	})
	.then((info)=> {
		console.log('DB Models initialized', chalk.blue(info));
		let appServer = require('./app/server/boot/build-server');
		return appServer.start(config);
	})
	.then((info)=> {
		console.log(`Starting Server at ${chalk.green(config.port)}`, chalk.blue(info));
	})
	.catch((error)=> {
		console.log(chalk.red(error));
		process.exit(0);
	});
