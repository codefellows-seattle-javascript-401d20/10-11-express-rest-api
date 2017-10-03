'use strict';

// mock env
process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Beer = require('../model/beer.js');
const server = require('../lib/server.js');

const apiURL = `http://localhost:${process.env.PORT}`;

const beerMockCreate = () => {
  return new Beer({
    brand: faker.lorem.words(10),
    type: faker.lorem.words(100),
    abv: 4.2,
  }).save();
};

describe('/api/beers', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Beer.remove({}));

  describe('POST /api/beers', () => {
    test('should respond with a beer and 200 status', () => {
      let tempBeer = {
        brand: faker.lorem.words(10),
        type: faker.lorem.words(100),
        abv: 4.2,
      };
      return superagent.post(`${apiURL}/api/beers`)
        .send(tempBeer)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.brand).toEqual(tempBeer.brand);
          expect(res.body.type).toEqual(tempBeer.type);
          expect(res.body.abv).toEqual(tempBeer.abv);
        });
    });

    test('should respond with a 400 status', () => {
      let mockBeer = {
        type: faker.lorem.words(100),
      };
      return superagent.post(`${apiURL}/api/beers`)
        .send(mockBeer)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });

  describe('GET /api/beers', () => {
    test('should respond with a beer and 200 status', () => {
      let tempBeer;
      return beerMockCreate()
        .then(beer => {
          tempBeer = beer;
          return superagent.get(`${apiURL}/api/beers/${beer._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempBeer._id.toString());
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.brand).toEqual(tempBeer.brand);
          expect(res.body.type).toEqual(tempBeer.type);
          expect(res.body.abv).toEqual(tempBeer.abv);
        });
    });

    test('should respond with 404 status', () => {
      return superagent.get(`${apiURL}/api/beers/helloworld`)
        // .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });

    test('should respond with a 404 status', () => {
      return superagent.get(`${apiURL}/api/beers/111111111`)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });
});
