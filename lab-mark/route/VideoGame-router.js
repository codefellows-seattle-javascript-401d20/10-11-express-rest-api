'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();

const VideoGame = require('../model/VideoGame.js');
const videoGameRouter = module.exports = new Router();

videoGameRouter.post('/api/videogames', jsonParser, (req, res, next) => {
  if(!req.body.title || !req.body.console || !req.body.genre)
    return next(httpErrors(400, 'title and content are required'));

  new VideoGame(req.body).save()
    .then(videoGame => res.json(videoGame))
    .catch(next);
});

videoGameRouter.get('/api/videogames/:id', (req, res, next) => {
  VideoGame.findById(req.params.id)
    .then(videoGame => {
      if(!videoGame)
        throw httpErrors(404, 'Videogame not found');
      res.json(videoGame);
    })
    .catch(next);
});

videoGameRouter.get('/api/videogames', (req, res, next) => {
  let {page='0'} = req.query;
  page = Number(page);
  if(isNaN(page))
    page = 0;
  page = page < 0 ? 0 : page;

  let videoGamesCache;
  VideoGame.find({})
    .skip(page * 10)
    .limit(10)
    .then(videoGames => {
      videoGamesCache = videoGames;
      return VideoGame.find({}).count();
    })
    .then(count => {
      let result = {
        count,
        data: videoGamesCache,
      };

      let lastPage = Math.floor(count / 10);
      res.links({
        next: `http://localhost/api/videogames?page=${page+1}`,
        prev: `http://localhost/api/videogames?page=${page < 1 ? 0 : page - 1}`,
        last: `http://localhost/api/videogames?page=${lastPage}`,
      });
      res.json(result);

    })
    .catch(next);
});

videoGameRouter.delete('/api/videogames/:id', (req, res, next) => {
  VideoGame.findByIdAndRemove(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});

videoGameRouter.delete('/api/videogames', () => {
  // No delete all feature!
  throw httpErrors(400, 'Can\'t delete all notes.');
});

videoGameRouter.put('/api/videogames/:id', jsonParser, (req, res, next) => {
  if(!req.body.title || !req.body.console || !req.body.genre)
    throw httpErrors(400, 'Request needs title, console, and genre');

  VideoGame.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true})
    .then((videoGame) => {
      if(!videoGame)
        throw httpErrors(404, 'videogame not found');
      res.json(videoGame);
    })
    .catch(next);
});
