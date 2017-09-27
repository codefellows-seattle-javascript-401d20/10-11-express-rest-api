'use strict';

// npm dependencies
const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();

// app dependencies
const Book = require('../model/book.js');
// module interface
const bookRouter = module.exports = new Router();

// POST /api/<resource-name>
// pass data as stringifed JSON in the body of a POST request to create a new resource
// on success respond with a 200 status code and the created book
// on failure due to a bad request send a 400 status code
bookRouter.post('/api/books', jsonParser, (req, res, next) => {
  // create a book using the parsed body
  // and respond to the client
  if(!req.body.title || !req.body.author || !req.body.description)
    next(httpErrors(400, 'title, author, and description are required'));

  new Book(req.body).save()
    .then(book => res.json(book))
    .catch(next);
});

// GET /api/<resource-name> and GET /api/<resource-name>?id={id}
// with no id in the query string it should respond with an array of all of your resources
// with an id in the query string it should respond with the details of a specifc resource (as JSON)
// if the id is not found respond with a 404
bookRouter.get('/api/books/:id', (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if(!book)
        throw httpErrors(404, 'Book not found');
      res.json(book);
    })
    .catch(next);
});

// DELETE /api/<resource-name?id={id}>
// the route should delete a book with the given id
// on success this should return a 204 status code with no content in the body
// on failure due to lack of id in the query respond with a 400 status code
// on failure due to a resouce with that id not existing respond with a 404 status code
bookRouter.delete('/api/books/:id', (req, res, next) => {
  Book.findByIdAndRemove(req.params.id)
    .then(book => {
      if(!book) throw httpErrors(404, 'book not found');
      res.sendStatus(204);
    })
    .catch(next);
});

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
