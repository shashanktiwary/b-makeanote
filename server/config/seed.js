/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
// Insert seed models below
var Thing = require('../api/note/note.model');


// Insert seed data below
var thingSeed = require('../api/note/note.seed.json');

// Insert seed inserts below
Thing.find({}).remove(function() {
  Thing.create(thingSeed);
});