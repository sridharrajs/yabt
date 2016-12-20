/**
 * Created by sridharrajs.
 */

'use strict';

let express = require('express');
let app = express.Router();

let batchController = require('../controllers/batch-controller');

function addAll(req, res) {
  let articles = req.articles;
  batchController.addAll(articles).then(()=> {
    return res.status(200).send({
      msg: 'Success'
    });
  }).catch((err) => {
    return res.status(500).send({
      msg: err
    });
  });
}

let allowOptions = require('allow-options');
let uploadHandler = require('../middleware/uploader');
let pocketParser = require('../middleware/pocket-parser');
app.post('/pocket', [allowOptions, uploadHandler, pocketParser], addAll);

module.exports = (indexRoute)=>{
  indexRoute.use('/api/import', app);
};

