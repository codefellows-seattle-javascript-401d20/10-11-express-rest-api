'use strict';

const {Router} = require('express')
const jsonParser = require('body-parser').json()

const Book = require('../model/bookbought.js')
const bookRouter = module.exports = new Router()

bookRouter.post('/api/books', jsonParser, (req, res, next) => {
  // create a book using the parsed body
  // and respond to the client
  if(!req.body.title || !req.body.content)
    return res.sendStatus(400)

  new Book(req.body).save()
  .then(book => res.json(book))
  .catch(err => {
    console.error('__SERVER_ERROR__', err)
    res.sendStatus(500)
  })
})

// router paramiters
bookRouter.get('/api/books', (req, res, next) => {
  Book.findById(req.params.id)
  .then(book => {
    if(!book)
      return res.sendStatus(404)
    res.json(book)
  })
  .catch(err => {
    console.error(err)
    if(err.message.indexOf('Cast to ObjectId failed') > -1)
      return res.sendStatus(404)
    res.sendStatus(500)
  })
})
bookRouter.get('/api/books/:id', (req, res, next) => {
  Book.findById(req.params.id)
  .then(book => {
    if(!book)
      return res.sendStatus(404)
    res.json(book)
  })
  .catch(err => {
    console.error(err)
    if(err.message.indexOf('Cast to ObjectId failed') > -1)
      return res.sendStatus(404)
    res.sendStatus(500)
  })
})
bookRouter.delete('/api/books/:id', (req, res, next) => {
  Book.findById(req.params.id)
  .then(book => {
    if(!book)
      return res.sendStatus(404)
    res.json(book)
  })
  .catch(err => {
    console.error(err)
    if(err.message.indexOf('Cast to ObjectId failed') > -1)
      return res.sendStatus(404)
    res.sendStatus(500)
  })
})
