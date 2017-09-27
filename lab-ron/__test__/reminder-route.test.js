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

  describe('GET /api/reminders:id', () => {
    test('should respond with a reminder and a 200', () => {
      let tempReminder;
      return reminderMockCreate()
        .then(reminder => {
          tempReminder = reminder;
          return superagent.get(`${apiURL}/api/reminders/${reminder._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempReminder._id.toString());
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.task).toEqual(tempReminder.task);
          expect(res.body.priority).toEqual(tempReminder.priority);
          expect(res.body.done).toBeFalsy();
        });
    });

    test('should respond with a 404 status', () => {
      return superagent.get(`${apiURL}/api/reminders/coolbeans`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });

  });

  describe('DELETE /api/reminders:id', () => {
    test('should respond with a 204', () => {
      // put data in the db to delete
      return reminderMockCreate()
        .then(reminder => {
          return superagent.delete(`${apiURL}/api/reminders/${reminder._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(204);
        });
    });

    test('should respond with a 404', () => {
      // put data in the db to delete
      return superagent.delete(`${apiURL}/api/reminders/coolbeans`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('PUT /api/reminders:id', () => {
    test('should update reminder and respond with 200', () => {
      let tempReminder;
      return reminderMockCreate()
        .then(reminder => {
          tempReminder = reminder;
          return superagent.put(`${apiURL}/api/reminders/${reminder._id}`)
            .send({ title: 'cool beans' });
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.title).toEqual('cool beans');
          expect(res.body.content).toEqual(tempReminder.content);
          expect(res.body._id).toEqual(tempReminder._id.toString());
        });
    });
  });
});