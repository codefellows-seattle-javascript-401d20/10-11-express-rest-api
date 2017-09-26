'use strict';

process.env.PORT = 8008;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Reminder = require('../model/reminder.js');
const server = require('../lib/server.js');

const apiURL = `http://localhost:${process.env.PORT}`;

const reminderMockCreate = () => {
  return new Reminder({
    task: faker.lorem.words(3),
    priority: 'low',
  });
};

describe('/api/reminders', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Reminder.remove({}));


  describe('POST /api/reminders', () => {

    test('should respond with a 400 status', () => {
      let tempReminder = {
        // task: faker.lorem.words(3),
        priority: 'low',
      };

      return superagent.post(`${apiURL}/api/reminders`)
        .send(tempReminder)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    test('should respond with a reminder and a 200 status', () => {
      let tempReminder = {
        task: faker.lorem.words(3),
        priority: 'low',
      };

      return superagent.post(`${apiURL}/api/reminders`)
        .send(tempReminder)
        .then(res => {
          console.log('rest.body', res.body);
          expect(res.status).toEqual(200);
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.task).toEqual(tempReminder.task);
          expect(res.body.priority).toEqual(tempReminder.priority);
          expect(res.body.done).toBeFalsy();
        });
    });
  });
});