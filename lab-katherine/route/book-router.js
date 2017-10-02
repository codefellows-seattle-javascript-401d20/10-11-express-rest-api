'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();

const Book = require('../model/book.js');
const bookRouter = module.exports = new Router();

// POST /api/<resource-name>
bookRouter.post('/api/books', jsonParser, (req, res, next) => {
  if(!req.body.title || !req.body.author || !req.body.description)
    return next(httpErrors(400, 'title, author, and description are required'));

  new Book(req.body).save()
    .then(book => res.json(book))
    .catch(next);
});

// GET /api/<resource-name>
bookRouter.get('/api/books/:id', (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if(!book)
        throw httpErrors(404, 'book not found');
      res.json(book);
    })
    .catch(next);
});

// DELETE /api/<resource-name>?id={id}
bookRouter.delete('/api/books/:id', (req, res, next) => {
  Book.findByIdAndRemove(req.params.id)
    .then(book => {
      if(!book) throw httpErrors(404, 'book not found');
      res.sendStatus(204);
    })
    .catch(next);
});

// DELETE /api/<resource-name>
bookRouter.delete('/api/books/', (req, res, next) => {
  if(!req.params.id)
    return next(httpErrors(400, 'id is required'));
});

// GET /api/<resource-name>
bookRouter.get('/api/books', (req, res, next) => {
  let {page='0'} = req.query;
  page = Number(page);
  if(isNaN(page)) page = 0;
  page = page < 0 ? 0 : page;

  let booksCache;
  Book.find({})
    .skip(page * 100)
    .limit(100)
    .then(books => {
      booksCache = books;
      return Book.find({}).count();
    })
    .then(count => {
      let result = {
        count,
        data: booksCache,
      };

      let lastPage = Math.floor(count / 100);
      res.links({
        next: `http://localhost/api/books?page=${page+1}`,
        prev: `http://localhost/api/books?page=${page < 1 ? 0 : page - 1}`,
        last: `http://localhost/api/books?page=${lastPage}`,
      });
      res.json(result);
    });
});
