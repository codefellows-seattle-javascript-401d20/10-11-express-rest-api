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

videoGameRouter.delete('/api/videogames/:id', (req, res) => {

  if(!req.params.id)
    return res.sendStatus(400);

  VideoGame.findById(req.params.id)
    .then(videoGame => {
      if(!videoGame)
        return res.sendStatus(404);
      VideoGame.remove(videoGame)
        .then(res.sendStatus(204))
        .catch(err => {
          console.error(err);
          if(err.message.indexOf('Cast to ObjectId failed') > -1)
            return res.sendStatus(404);
          res.sendStatus(500);
        });
    })
    .catch(err => {
      console.error(err);
      if(err.message.indexOf('Cast to ObjectId failed') > -1)
        return res.sendStatus(404);
      res.sendStatus(500);
    });
});
