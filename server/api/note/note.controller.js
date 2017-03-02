/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /notes              ->  index
 * POST    /notes              ->  create
 * GET     /notes/:id          ->  show
 * PUT     /notes/:id          ->  update
 * DELETE  /notes/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Notes = require('./note.model');

// Get list of notes
exports.index = function (req, res) {

  var query = { userId: req.user._id, active: true };

  if (req.query.published)
    query.published = req.query.published;

  Notes.find(query, function (err, notes) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(notes);
  });
};

// Get a single Notes
exports.show = function (req, res) {
  Notes.findById(req.params.id, function (err, note) {
    if (err) { return handleError(res, err); }
    if (!note || !req.user._id.equals(note.userId)) { return res.status(404).send('Not Found'); }
    return res.json(note);
  });
};

// Creates a new note in the DB.
exports.create = function (req, res) {
  let note = req.body;
  note.active = true;
  note.published = false;
  note.userId = null;
  note.createdOn = new Date();
  note.updatedOn = new Date();
  note.publishedOn = null;
  note.userId = req.user._id;

  Notes.create(note, function (err, note) {
    if (err) { return handleError(res, err); }
    return res.status(201).json(note);
  });
};

// Updates an existing note in the DB.
exports.update = function (req, res) {
  let note = req.body;
  if (note._id) { delete note._id; }
  Notes.findById(req.params.id, function (err, dbnote) {
    if (err) { return handleError(res, err); }
    if (!dbnote || !req.user._id.equals(dbnote.userId)) { return res.status(404).send('Not Found'); }

    // Updates
    note.updatedOn = new Date();
    if (note.published)
      note.publishedOn = new Date();

    var updated = _.merge(dbnote, note);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(dbnote);
    });
  });
};

// Deletes a note from the DB.
exports.destroy = function (req, res) {
  Notes.findById(req.params.id, function (err, note) {
    if (err) { return handleError(res, err); }
    if (!note) { return res.status(404).send('Not Found'); }
    note.remove(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}