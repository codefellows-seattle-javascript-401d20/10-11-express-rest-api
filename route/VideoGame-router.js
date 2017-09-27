'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const VideoGame = require('../model/VideoGame.js');
const videoGameRouter = module.exports = new Router();

videoGameRouter.post('/api/videogames', jsonParser, (req, res) => {
  if(!req.body.title || !req.body.console || !req.body.genre)
    return res.sendStatus(400);

  new VideoGame(req.body).save()
    .then(videoGame => res.json(videoGame))
    .catch(err => {
      console.error('__SERVER_ERROR__', err);
      res.sendStatus(500);
    });
});

videoGameRouter.get('/api/videogames/:id', (req, res) => {

  VideoGame.findById(req.params.id)
    .then(videoGame => {
      if(!videoGame)
        return res.sendStatus(404);
      res.json(videoGame);
    })
    .catch(err => {
      console.error(err);
      if(err.message.indexOf('Cast to ObjectId failed') > -1)
        return res.sendStatus(404);
      res.sendStatus(500);
    });
});

videoGameRouter.get('/api/videogames', (req, res) => {

  VideoGame.find({})
    .then(videoGame => {
      res.json(videoGame);
    })
    .catch(err => {
      console.error(err);
      if(err.message.indexOf('Cast to ObjectId failed') > -1)
        return res.sendStatus(404);
      res.sendStatus(500);
    });
});

videoGameRouter.delete('/api/videogames/:id', (req, res) => {

  VideoGame.findByIdAndRemove(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(err => {
      console.error(err);
      if(err.message.indexOf('Cast to ObjectId failed') > -1)
        return res.sendStatus(404);
      res.sendStatus(500);
    });
});

videoGameRouter.delete('/api/videogames', (req, res) => {
  // No delete all feature!
  return res.sendStatus(400);
});

videoGameRouter.put('/api/videogames/:id', jsonParser, (req, res) => {

  if(!req.body.title || !req.body.console || !req.body.genre)
    return res.sendStatus(400);

  req.body.timestamp = new Date();

  VideoGame.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then((videoGame) => {
      if(!videoGame)
        return res.sendStatus(404);
      res.json(videoGame);
    })
    .catch(err => {
      console.error(err);
      if(err.message.indexOf('Cast to ObjectId failed') > -1)
        return res.sendStatus(404);
      res.sendStatus(500);
    });
});