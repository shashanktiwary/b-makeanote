'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: String,
  note: String,
  active: Boolean,
  published: Boolean,
  userId: String,
  createdOn: Date,
  updatedOn: Date,
  publishedOn : Date
});

module.exports = mongoose.model('Note', NoteSchema);