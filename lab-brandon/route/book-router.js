'use strict';


const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

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
    })
    .catch(next);
});
bookRouter.get('/api/books/:id', (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if(!book)
        return res.sendStatus(404);
      res.json(book);
    })
    .catch(next);
});
bookRouter.delete('/api/books/:id', (req, res, next) => {
  Book.findByIdAndRemove(req.params.id)
    .then(book => {
      if(!book)
        throw httpErrors(404, 'book not found');
      res.sendStatus(204);
    })
    .catch(next);
});
bookRouter.put('/api/books/:id', jsonParser, (req, res, next) => {
  let options = {runValidators: true, new: true};
  Book.findByIdAndUpdate(req.params.id, req.body, options)
    .then(book => {
      if(!book) throw httpErrors(404, 'book not found');
    })
    .catch(next);
});
bookRouter.get('/api/books', (req, res, next) => {
  let {page='0'} = req.query ;
  page = Number(page);
  if(isNaN(page)) page = 0;
  page = page < 0 ? 0 : page;

  let bookscache;
  Book.find({})
    .skip(page * 100)
    .limit(100)
    .then(books => {
      bookscache = books;
      return Book.find({}).count();
    })
    .then(count => {
      let result = {
        count,
        data: bookscache,
      };

      let lastPageOfBook = Math.floor(count / 100);
      res.links({
        next: `http://localhost/api/books?page=${page+1}`,
        prev: `http://localhost/api/books?page=${page < 1 ? 0 : page - 1}`,
        last: `http://localhost/api/books?page=${lastPageOfBook}`,
      });
      res.json(result);
    });
});
