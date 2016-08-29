/**
 * Created by sridharrajs on 7/7/16.
 */

'use strict';

let chalk = require('chalk');

let config = require('../config');
let bootUtils = require('../app/utils/boot-utils');
let models = require('../app/models');

const HOST_ENVIRONMENT = process.env.NODE_ENV;
const MY_SECRET = process.env.MY_SECRET;

class Sequence {

	static load() {
		return bootUtils.isValidEnv(HOST_ENVIRONMENT).then((info)=> {
			console.log('Checking Environment ', chalk.blue(info));
			return bootUtils.isSecretSet(MY_SECRET);
		}).then((info)=> {
			console.log('Checking tokens ', chalk.blue(info));
			return config.init(HOST_ENVIRONMENT);
		}).then((info)=> {
			console.log('Initializing settings ', chalk.blue(info));
			return models.init();
		}).then((info)=> {
			console.log('DB Models initialized', chalk.blue(info));
			let connectionFactory = require('../app/boot/connection-factory');
			return connectionFactory.connect(config);
		});
	}

}

module.exports = Sequence;