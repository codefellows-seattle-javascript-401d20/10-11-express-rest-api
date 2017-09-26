'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Book = require('../model/bookbought.js');
const bookRouter = module.exports = new Router();

bookRouter.post('/api/books', jsonParser, (req, res, next) => {
  // create a book using the parsed body
  // and respond to the client
  if(!req.body.title || !req.body.content || !req.body.author)
    return res.sendStatus(400);

  new Book(req.body).save()
  .then(book => res.json(book))
  .catch(next);
});

// router paramiters
// single book array
bookRouter.get('/api/books', (req, res, next) => {
  Book.findById(req.params.id)
  .then(book => {
    if(!book)
      return res.sendStatus(404);
    res.json(book);
  });
  .catch(next);
});
bookRouter.get('/api/books/:id', (req, res, next) => {
  Book.findById(req.params.id)
  .then(book => {
    if(!book)
      return res.sendStatus(404)
    res.json(book)
  })
  .catch(next)
});
bookRouter.delete('/api/books/:id', (req, res, next) => {
  Book.findByIdAndRemove(req.params.id)
  .then(book => {
    if(!book){
      throw httpErrors(404, 'book not found');
    res.sendStatus(204);

  });
  .catch(next);

});
bookRouter.put('/api/books/:id', jsonParser, (req, res, next) => {
  let options = {runValidators: true, new: true}
  Book.findByIdAndUpdate(req.params.id, req.body, options)
  .then(book => {
    if(!book) throw httpErrors(404, 'book not found')
  })
  .catch(next)
});
