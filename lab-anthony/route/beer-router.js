'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Beer = require('../model/beer.js');
const beerRouter = module.exports = new Router();

beerRouter.get('/api/beers', (req, res) => {
  Beer.find({})
    .then(beers => res.json(beers));
});

beerRouter.post('/api/beers', jsonParser, (req, res, next) => {
  // create a beer using the parsed body
  // and respond to the client
  if(!req.body.brand || !req.body.type)
    return res.sendStatus(400);

  new Beer(req.body).save()
    .then(beer => res.json(beer))
    .catch(err => {
      console.error('__SERVER_ERROR__', err);
      res.sendStatus(500);
    });
});

// router paramiters
beerRouter.get('/api/beers/:id', (req, res, next) => {
  Beer.findById(req.params.id)
    .then(beer => {
      if(!beer)
        return res.sendStatus(404);
      res.json(beer);
    })
    .catch(err => {
      // console.error(err);
      if(err.message.indexOf('Cast to ObjectId failed') > -1)
        return res.sendStatus(404);
      res.sendStatus(500);
    });
});

beerRouter.delete('/api/beers/:id', (req, res, next) => {
  Beer.findById(req.params.id)
    .then(beer => {
      if(!beer)
        return res.sendStatus(404);
      Beer.deleteOne({_id : beer._id})
        .then((results) => {

          if(results.deletedCount === 1) return res.sendStatus(204);
          res.sendStatus(500);
        });
    })
    .catch(error => {
      res.sendStatus(400);
    });
});
