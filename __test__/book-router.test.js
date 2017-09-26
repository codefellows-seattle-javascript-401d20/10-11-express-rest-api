'use strict';

// mock env
process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Book = require('../model/book.js');
const server = require('../lib/server.js');

const apiURL = `http://localhost:${process.env.PORT}`;

const bookMockCreate = () => {
  return new Book({
    title: faker.lorem.words(10),
    author: faker.name.findName(),
    description: faker.lorem.words(100),
    publisher: faker.lorem.words(10),
  }).save();
};

describe('/api/books', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Book.remove({}));

  // POST /api/<resource-name>
  // pass data as stringifed JSON in the body of a POST request to create a new resource
  // on success respond with a 200 status code and the created note
  // on failure due to a bad request send a 400 status code
  describe('POST /api/books', () => {
    test('should respond with a book and 200 status', () => {
      let tempBook = {
        title: faker.lorem.words(10),
        author: faker.lorem.words(10),
        description: faker.lorem.words(100),
        publisher: faker.lorem.words(10),
      };
      return superagent.post(`${apiURL}/api/books`)
        .send(tempBook)
        .then(res => {
          expect(res.status).toEqual(200);
          console.log('res.body', res.body);
          expect(res.body._id).toBeTruthy();
          expect(res.body.title).toEqual(tempBook.title);
          expect(res.body.author).toEqual(tempBook.author);
          expect(res.body.description).toEqual(tempBook.description);
          expect(res.body.publisher).toEqual(tempBook.publisher);
        });
    });

    test('should respond with a book and 400 status', () => {
      let mockBook = {
        description: faker.lorem.words(100),
      };
      return superagent.post(`${apiURL}/api/books`)
        .send(mockBook)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });

  // GET /api/<resource-name> and GET /api/<resource-name>?id={id}
  // with no id in the query string it should respond with an array of all of your resources
  // with an id in the query string it should respond with the details of a specifc resource (as JSON)
  // if the id is not found respond with a 404
  describe('GET /api/notes', () => {
    test('should respond with a book and 200 status', () => {
      let tempBook;
      return bookMockCreate()
        .then(book => {
          tempBook = book;
          return superagent.get(`${apiURL}/api/books/${book.id}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body_id).toBeTruthy();
          expect(res.body.title).toEqual(tempBook.title);
          expect(res.body.author).toEqual(tempBook.author);
          expect(res.body.description).toEqual(tempBook.description);
          expect(res.body.publisher).toEqual(tempBook.publisher);
        });
    });

    // USE model.find() to get array of books
    test('should respond with array of all books', () => {
      return superagent.get(`${apiURL}/api/books`)
        .then(Book.find());
    });

    test('should respond with 404 status', () => {
      return superagent.get(`${apiURL}/api/notes/helloworld`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });
});
