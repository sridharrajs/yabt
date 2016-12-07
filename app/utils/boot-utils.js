/**
 * Created by sridhar on 29/08/16.
 */

'use strict';

let _ = require('lodash');

const ENVS = [
    'production',
    'local'
];

class BootUtils {

    static isValidEnv(HOST_ENV) {
        if (_.includes(ENVS, HOST_ENV)) {
            return Promise.resolve('Success');
        } else {
            return Promise.reject(new Error('HOST_ENV isn\'t set'));
        }
    }

    static isSecretSet(MY_SECRET) {
        if (_.isEmpty(MY_SECRET)) {
            return Promise.reject(new Error('Secret isn\'t set'));
        } else {
            return Promise.resolve('Success');
        }
    }

}

module.exports = BootUtils;
