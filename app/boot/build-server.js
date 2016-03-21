/**
 * Created by sridharrajs.
 */

'use strict';

import https from 'https';
import http from 'http';

import {app as application} from '../application';

function getServerByProtocol(config, app) {
	if (config.secure) {
		return https.createServer(config.options, app);
	}
	return http.createServer(app);
}

class Server {
	static start(config) {
		let server = getServerByProtocol(config, application);
		return new Promise((resolve, reject)=> {
			server.listen(config.port, ()=> {
				resolve('success');
			}).on('error', (err)=> {
				reject(err);
			});
		});
	}
}

module.exports = Server;