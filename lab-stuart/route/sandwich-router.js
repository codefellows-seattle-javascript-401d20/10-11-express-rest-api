'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Sandwich = require('../model/sandwich.js');
const sandwichRouter = module.exports = new Router();

sandwichRouter.post('/api/sandwiches', jsonParser, (req, res, next) => {
  if(!req.body.bread || !req.body.cheese || !req.body.spread)
    return res.sendStatus(400);
  new Sandwich(req.body).save()
  .then(sandwich => res.json(sandwich))
  .catch(err => {
    console.error('::SERVER_ERROR::', err);
    res.sendStatus(500);
  });
});

sandwichRouter.get('/api/sandwiches/:id', (req, res, next) => {
  Sandwich.findById(req.params.id)
  .then(sandwich => {
    if(!sandwich)
      return res.sendStatus(404);
    res.json(sandwich);
  })
  .catch(err => {
    console.error(err);
    if(err.message.indexOf('Cast to ObjectId failed') > -1)
      return res.sendStatus(404);
    res.sendStatus(500);
  });
});
