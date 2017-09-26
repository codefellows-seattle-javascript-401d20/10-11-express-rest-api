'use strict';

// mock env
process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const VideoGame = require('../model/VideoGame.js');
const server = require('../lib/server.js');

const apiURL = `http://localhost:${process.env.PORT}`;

const videogameMockCreate = () => {
  return new VideoGame({
    title: faker.lorem.words(10),
    genre: faker.lorem.words(10),
    console: faker.lorem.words(10),
  }).save();
};

describe('/api/videogames', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => VideoGame.remove({}));

  describe('POST /api/videogames', () => {
    test('should respond with a videogame and 200 status', () => {
      let tempVideoGame = {
        title: faker.lorem.words(10),
        genre: faker.lorem.words(10),
        console: faker.lorem.words(10),
      };
      return superagent.post(`${apiURL}/api/videogames`)
        .send(tempVideoGame)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.title).toEqual(tempVideoGame.title);
          expect(res.body.content).toEqual(tempVideoGame.content);
        });
    });

    test('should respond with a 400 status', () => {
      let mockVideoGame = {
        genre: faker.lorem.words(10),
        console: faker.lorem.words(10),
      };
      return superagent.post(`${apiURL}/api/videogames`)
        .send(mockVideoGame)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });

  describe('GET /api/videogames', () => {
    test('should respond with a videogame and 200 status', () => {
      let tempVideoGame;
      return videogameMockCreate()
        .then(videogame => {
          tempVideoGame = videogame;
          return superagent.get(`${apiURL}/api/videogames/${videogame._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempVideoGame._id.toString());
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.title).toEqual(tempVideoGame.title);
          expect(res.body.content).toEqual(tempVideoGame.content);
        });
    });

    test('should respond with an array of all videogames and 200 status', () => {
      let tempVideoGame;
      return videogameMockCreate()
        .then(videogame => {
          tempVideoGame = videogame;
          return superagent.get(`${apiURL}/api/videogames`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body[0]._id).toEqual(tempVideoGame._id.toString());
          expect(res.body[0].timestamp).toBeTruthy();
          expect(res.body[0].title).toEqual(tempVideoGame.title);
          expect(res.body[0].content).toEqual(tempVideoGame.content);
        });
    });

    test('should respond with 404 status', () => {
      return superagent.get(`${apiURL}/api/videogames/helloworld`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/videogames', () => {
    test('should respond with a 204 status', () => {
      return videogameMockCreate()
        .then(videogame => {
          return superagent.delete(`${apiURL}/api/videogames/${videogame._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(204);
        });
    });

    test('should respond with 404 status', () => {
      return superagent.delete(`${apiURL}/api/videogames/helloworld`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });

    test('should respond with 400 status', () => {
      return superagent.delete(`${apiURL}/api/videogames/`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });

  describe('PUT /api/videogames', () => {
    test('should respond with a 200 status', () => {
      let tempVideoGame = {
        title: faker.lorem.words(10),
        genre: faker.lorem.words(10),
        console: faker.lorem.words(10),
      };
      return videogameMockCreate()
        .then(videogame => {
          return superagent.put(`${apiURL}/api/videogames/${videogame._id}`)
            .send(tempVideoGame);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.title).toEqual(tempVideoGame.title);
          expect(res.body.content).toEqual(tempVideoGame.content);
        });
    });

    test('should respond with 404 status', () => {
      let tempVideoGame = {
        title: faker.lorem.words(10),
        genre: faker.lorem.words(10),
        console: faker.lorem.words(10),
      };
      return superagent.put(`${apiURL}/api/videogames/helloworld`)
        .send(tempVideoGame)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });

    test('should respond with 400 status', () => {
      let tempVideoGame = {
        title: faker.lorem.words(10),
        genre: faker.lorem.words(10),
        console: faker.lorem.words(10),
      };
      return superagent.delete(`${apiURL}/api/videogames/`)
        .send(tempVideoGame)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });
});
