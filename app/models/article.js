/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
  url: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false
  },
  host: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  is_fav: {
    type: Boolean,
    default: false
  },
  is_video: {
    type: Boolean,
    default: false
  },
  is_archived: {
    type: Boolean,
    default: false
  },
  time_added: {
    type: Date,
    default: Date.now
  },
  channel: {
    type: String,
    required: false,
    default: 'web'
  },
  content: {
    type: String,
    required: false
  },
  tags: [String]
});

//Adding composite index
schema.index({
  userId: 1,
  url: 1
}, {
  unique: true
});

let Article = mongoose.model('article', schema);

Article.on('index', (err) => {
  if (err) {
    console.log('Error while creating index for article', err);
  }
});

const ATTRIBUTES = [
  '_id',
  'url',
  'description',
  'tags',
  'userId',
  'is_fav',
  'title',
  'time_added',
  'is_video',
  'active',
  'host',
  'notes',
  'channel'
];

function getPublicAttributes() {
  return {
    _id: 1,
    url: 1,
    description: 1,
    tags: 1,
    is_fav: 1,
    title: 1,
    time_added: 1,
    is_video: 1,
    active: 1,
    host: 1,
    notes: 1,
    channel: 1
  };
}

function getAttributes() {
  return ATTRIBUTES;
}

module.exports = {
  getAttributes,
  getPublicAttributes
};
