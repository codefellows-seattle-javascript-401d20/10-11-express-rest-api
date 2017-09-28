'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Animal = require('../model/animal.js');
const animalRouter = module.exports = new Router();

animalRouter.get('/api/animals/:id', (req, res, next) => {
    Animal.findById(req.params.id)
        .then(animal => {
            if(!animal)
                return res.sendStatus(404);

            res.json(animal);
        })
        .catch(err => {
            if(err.message.indexOf('Cast to ObjectId failed') > -1)
                return res.sendStatus(404);

            res.sendStatus(500);
        });
});

animalRouter.get('/api/animals',(req,res,next) => {
    Animal.find({}).exec()
        .then(animals => {
            if(!animals)
                return res.sendStatus(404);
            res.json(animals);
        })
        .catch(err => {
            res.sendStatus(500);
        });
});

animalRouter.post('/api/animals',jsonParser,(req,res,next) => {
    if(!req.body.name || !req.body.species || !req.body.favoriteFood)
    {
        return res.sendStatus(400);
    }

    new Animal(req.body).save()
        .then(animal => res.json(animal))
        .catch(err => {
            console.error('__SERVER_ERROR__',err);
            res.sendStatus(500);
        });
});

// vinicio - using this route to verify we have an id
animalRouter.delete('/api/animals/', (req,res,next) => {
    res.sendStatus(400);
});

animalRouter.delete('/api/animals/:id', (req,res,next) => {
    Animal.findByIdAndRemove(req.params.id)
        .then(animal => {
            if(!animal)
                res.sendStatus(404);
            res.sendStatus(204);
        })
        .catch((err) => {
            if(err.message.indexOf('Cast to ObjectId failed') > -1)
                res.sendStatus(404);
        });
});