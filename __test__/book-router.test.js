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

let mockManyBooks = (num) => {
  return Promise.all(new Array(num).fill(0).map(() => bookMockCreate()));
};

describe('/api/books', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Book.remove({}));

  describe('POST /api/books', () => {
    // POST: test 200, it should respond with the body content
    // for a post request with a valid body
    test('should respond with a book and 200 status', () => {
      let tempBook = {
        title: faker.lorem.words(10),
        author: faker.name.findName(),
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

    // POST: test 400, it should respond with 'bad request'
    // if no request body was provided or the body was invalid
    test('should respond with a 400 status', () => {
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

  describe('GET /api/books/:id', () => {
    // GET: test 200, it should contain a response body
    // for a request made with a valid id
    test('should respond with a book and 200 status', () => {
      let tempBook;
      return bookMockCreate()
        .then(book => {
          tempBook = book;
          return superagent.get(`${apiURL}/api/books/${book._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempBook._id.toString());
          expect(res.body.title).toEqual(tempBook.title);
          expect(res.body.author).toEqual(tempBook.author);
          expect(res.body.description).toEqual(tempBook.description);
          expect(res.body.publisher).toEqual(tempBook.publisher);
        });
    });

    // GET: test 404, it should respond with 'not found'
    // for valid requests made with an id that was not found
    test('should respond with 404 status', () => {
      return superagent.get(`${apiURL}/api/notes/hihihi`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/books/:id', () => {
    test('should respond with a 204', () => {
      // put data in db to delete
      return bookMockCreate()
        .then(book => {
          return superagent.delete(`${apiURL}/api/books/${book._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(204);
        });
    });

    test('should respond with a 404', () => {
      return superagent.delete(`${apiURL}/api/notes/hahaha`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('GET /api/books', () => {
    test('should return 100 books', () => {
      return mockManyBooks(1000)
        .then(tempBooks => {
          return superagent.get(`${apiURL}/api/books`);
        })
        .then(res => {
          console.log(res.headers);
          expect(res.status).toEqual(200);
          expect(res.body.count).toEqual(1000);
          expect(res.body.data.length).toEqual(100);
        });
    });
  });
});
