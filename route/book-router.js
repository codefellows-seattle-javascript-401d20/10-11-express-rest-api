'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Book = require('../model/book.js');
const bookRouter = module.exports = new Router();

// POST /api/<resource-name>
// pass data as stringifed JSON in the body of a POST request to create a new resource
// on success respond with a 200 status code and the created note
// on failure due to a bad request send a 400 status code
bookRouter.post('/api/books', jsonParser, (req, res, next) => {
  // create a book using the parsed body
  // and respond to the client
  if(!req.body.title || !req.body.author || !req.body.description)
    return res.sendStatus(400);

  new Book(req.body).save()
    .then(book => res.json(book))
    .catch(err => {
      console.error('__SERVER_ERROR__', err);
      res.sendStatus(500);
    });
});

// GET /api/<resource-name> and GET /api/<resource-name>?id={id}
// with no id in the query string it should respond with an array of all of your resources
// with an id in the query string it should respond with the details of a specifc resource (as JSON)
// if the id is not found respond with a 404
bookRouter.get('/api/books/:id', (req, res, next) => {
  if (req.params.id){
    Book.findById(req.params.id)
      .then(book => {
        if(!book)
          return res.sendStatus(404);
        res.json(book);
      })
      .catch(err => {
        console.error(err);
        if(err.message.indexOf('Cast to ObjectId failed') > -1)
          return res.sendStatus(404);
        res.sendStatus(500);
      });
  } else {
    // send all the books
    // use model.find() to get array of books
    return Book.find()
      .then(books => res.json(books.map(book => book._id)))
      .catch(err => {
        console.error(err);
        res.sendStatus(res, 500);
      });
  }
});
