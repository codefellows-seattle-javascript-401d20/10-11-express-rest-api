'use strict';

process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Animal = require('../model/animal.js');
const server = require('../lib/server.js');

const apiURL = `http://localhost:${process.env.PORT}/api/animals`;

const animalMockCreate = () => {
    return new Animal({
        name : faker.name.firstName(),
        species : faker.name.jobTitle(),
        favoriteFood : faker.name.lastName(),
    }).save();
};

describe('/api/animals',() => {
    beforeAll(server.start);
    afterAll(server.stop);
    afterEach(() => Animal.remove({}));

    describe('POST /api/animals',() => {
        test('should respond with an animal and 200 status', () => {
            let tempAnimal =  {
                name : 'Simba',
                species : 'Lion',
                favoriteFood : 'Meat',
            };

            return superagent.post(apiURL)
                .send(tempAnimal)
                .then(res => {
                    expect(res.status).toEqual(200);
                    expect(res.body._id).toBeTruthy();
                    expect(res.body.timestamp).toBeTruthy();
                    expect(res.body.title).toEqual(tempAnimal.tit);
                    expect(res.body.content).toEqual(tempAnimal.content);
                });
        });
        
        test('should respond with a 400 status', () => {
            let corruptAnimal = {
                test : 'test',
            };

            return superagent.post(apiURL)
                .send(corruptAnimal)
                .then(Promise.reject)
                .catch(res => {
                    expect(res.status).toEqual(400);
                });
        });
    });

});

describe('GET /api/animals', () => {
    //---------------------------------------------------
    // vinicio - This has to appear in every describe
    //---------------------------------------------------
    beforeAll(server.start);
    afterAll(server.stop);
    afterEach(() => Animal.remove({}));
    //---------------------------------------------------

    test('should respond with an animal and 200 status', () => {
        let tempAnimal = {};
        return animalMockCreate()
            .then(animal => {
                tempAnimal = animal;
                return superagent.get(`${apiURL}/${animal._id}`);
            })
            .then(res => {
                expect(res.status).toEqual(200);
                expect(res.body._id).toEqual(tempAnimal._id.toString());
                expect(res.body.timestamp).toBeTruthy();
                expect(res.body.name).toEqual(tempAnimal.name);
                expect(res.body.species).toEqual(tempAnimal.species);
                expect(res.body.favoriteFood).toEqual(tempAnimal.favoriteFood);
            });
    });

    test('should respond a 404 status if there is no animal', () => {
        return superagent.get(`${apiURL}/123`)
            .then(Promise.reject)
            .catch(res => {
                expect(res.status).toEqual(404);
            });
    });

    test('should respond with an array of animals and 200 status', () => {
        animalMockCreate();
        animalMockCreate();
        animalMockCreate();

        return superagent.get(`${apiURL}/`)
            .then(res => {
                expect(res.status).toEqual(200);
                expect(res.body.length).toEqual(3);
            });
    });
});

describe('DELETE /api/animals', () => {
    //---------------------------------------------------
    // vinicio - This has to appear in every describe
    //---------------------------------------------------
    beforeAll(server.start);
    afterAll(server.stop);
    afterEach(() => Animal.remove({}));
    //---------------------------------------------------

    test('should respond with a 400 code if there is no id', () => {
        return superagent.delete(`${apiURL}/`)
            .then(Promise.reject)
            .catch(res => {
                expect(res.status).toEqual(400);
            });
    });

    test('should return 404 if the id is not found', () => {
        return superagent.delete(`${apiURL}/123`)
            .then(Promise.reject)
            .catch(res => {
                expect(res.status).toEqual(404);
            });
    });

    test('should respond with an animal and 200 status if the id is correct', () => {
        return animalMockCreate()
            .then(animal => {
                return superagent.delete(`${apiURL}/${animal._id}`);
            })
            .then(res => {
                expect(res.status).toEqual(204);
                expect(res.body).toEqual({});
            });
    });
});
