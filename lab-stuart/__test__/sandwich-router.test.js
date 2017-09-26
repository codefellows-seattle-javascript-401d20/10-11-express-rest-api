'use strict';

process.env.PORT = 6000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Sandwich = require('../model/sandwich.js');
const server = require('../lib/server.js');

const apiURL = `http://localhost:${process.env.PORT}`;

const sandwichMockCreate = () => {
  return new Sandwich({
    bread: faker.lorem.words(4),
    cheese: faker.lorem.words(4),
    spread: faker.lorem.words(4),
  }).save();
};

describe('/api/sandwiches', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Sandwich.remove({}));

  describe('POST /api/sandwiches', () => {
    test('should respond with a sandwich and 200 status', () => {
      let tempSandwich = {
        bread: faker.lorem.words(4),
        cheese: faker.lorem.words(4),
        spread: faker.lorem.words(4),
      };
      return superagent.post(`${apiURL}/api/sandwiches`)
      .send(tempSandwich)
      .then(res => {
        expect(res.status).toEqual(200);
        console.log('res.body', res.body);
        expect(res.body._id).toBeTruthy();
        expect(res.body.bread).toEqual(tempSandwich.bread);
        expect(res.body.cheese).toEqual(tempSandwich.cheese);
        expect(res.body.spread).toEqual(tempSandwich.spread);
      });
    });

    test('should respond with a 400 status', () => {
      let tempSandwich = {
        bread: faker.lorem.words(4),
      };
      return superagent.post(`${apiURL}/api/sandwiches`)
      .send(tempSandwich)
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });
  });

  describe('GET /api/sandwiches', () => {
    test('should respond with a sandwich and 200 status', () => {
      let tempSandwich; 
      return sandwichMockCreate()
      .then(sandwich => {
        tempSandwich = sandwich;
        return superagent.get(`${apiURL}/api/sandwiches/${sandwich._id}`);
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(tempSandwich._id.toString());
        expect(res.body.bread).toEqual(tempSandwich.bread);
        expect(res.body.cheese).toEqual(tempSandwich.cheese);
        expect(res.body.spread).toEqual(tempSandwich.spread);
      });
    });

    test('should respond with 404 status', () => {
      return superagent.get(`${apiURL}/api/sandwiches/nope`)
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
  });
});
