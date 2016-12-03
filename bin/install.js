/**
 * Created by sridharrajs on 7/7/16.
 */

'use strict';

const bcrypt = require('bcrypt-as-promised');
let chalk = require('chalk');

let bootSequence = require('./boot-sequence');

const EMAIL = '9@9.com';
const PASSWORD = '9';

let userId = '';

bootSequence.load().then(()=> {
    return bcrypt.hash(PASSWORD);
}).then((hashedPassword)=> {
    let userController = require('../app/controllers/user-controller');
    return userController.createAdmin({
	email: EMAIL,
	password: hashedPassword
    });
}).then((adminUser)=> {
    userId = adminUser._id;
    let config = require('../config');
    let pageController = require('../app/controllers/page-controller');
    return pageController.fetchPage(config.defaultArticle);
}).then((article)=> {
    let articleController = require('../app/controllers/article-controller');
    article.userId = userId;
    return articleController.add(article);
}).then(()=> {
    console.log(chalk.green('Admin created'));
    process.exit(0);
}).catch((err) => {
    console.log('Installation failed', chalk.red(err));
    process.exit(0);
});
