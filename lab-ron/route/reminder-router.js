'use strict';

const { Router } = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();

const Reminder = require('../model/reminder.js');
const reminderRouter = module.exports = new Router();

reminderRouter.post('/api/reminders', jsonParser, (req, res, next) => {
  if (!req.body.task)
    next(httpErrors(400, 'title and content are required'));

  new Reminder(req.body).save()
    .then(reminder => res.json(reminder)) // ask about .json()
    .catch(next);
});

reminderRouter.get('/api/reminders/:id', (req, res, next) => {
  Reminder.findById(req.params.id)
    .then(reminder => {
      if (!reminder) throw httpErrors(404, 'reminder not found');
      res.json(reminder);
    })
    .catch(next);
});


reminderRouter.delete('/api/reminders/:id', (req, res, next) => {
  Reminder.findByIdAndRemove(req.params.id)
    .then(reminder => {
      if (!reminder) throw httpErrors(404, 'reminder not found');
      res.sendStatus(204);
    })
    .catch(next);
});

reminderRouter.put('/api/reminders/:id', jsonParser, (req, res, next) => {
  let options = { runValidators: true, new: true };
  Reminder.findByIdAndUpdate(req.params.id, req.body, options)
    .then(reminder => {
      if (!reminder) throw httpErrors(404, 'reminder not found');
      res.json(reminder);
    })
    .catch(next);

});
