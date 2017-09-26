'use strict';

const { Router } = require('express');
const jsonParser = require('body-parser').json();

const Reminder = require('../model/reminder.js');
const reminderRouter = module.exports = new Router();

reminderRouter.post('/api/reminders', jsonParser, (req, res, next) => {
  if (!req.body.task)
    return res.sendStatus(400);

  new Reminder(req.body).save()
    .then(reminder => res.json(reminder))
    .catch(err => {
      console.error('SERVER ERROR:', err);
      res.sendStatus(500);
    });
});

reminderRouter.get('/api/reminders/:id', (req, res, next) => {
  Reminder.findById(req.params.id)
    .then(reminder => {
      if (!reminder)
        return res.sendStatus(404);
      res.json(reminder);
    })
    .catch(err => {
      console.error(err);
      if (err.message.indexOf('Cast to ObjectId failed') > -1)
        return res.sendStatus(404);
      res.sendStatus(500);
    });
});

