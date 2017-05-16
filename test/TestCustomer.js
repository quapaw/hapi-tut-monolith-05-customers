'use strict';

const Code            = require('code');
const Lab             = require('lab');
const LabbableServer  = require('../localServer.js');

const expect     = Code.expect;
const lab        = exports.lab = Lab.script();
const test       = lab.test;
const before     = lab.before;
const experiment = lab.experiment;

const Customer_123  = require('../samples/customer_123.json');
const Customer_124  = require('../samples/customer_124.json');
const Customer_125  = require('../samples/customer_125.json');

let server;

before((done) => {

    LabbableServer.ready( (err, srv) => {

        if (err) {
            return done(err);
        }

        server = srv;

        const db = server.connections[0].server.mongo.db;
        db.collection('customers').deleteMany({}, (err, r) => {

            if (err) {
                console.log('error in clearing customers collection');
            }

            return done();
        });
    });
});

experiment('Test if Initialized', () => {

    test('Test if server is Initialized', (done) => {

        expect(server).to.exist();
        expect(LabbableServer.isInitialized()).to.equal(true);
        done();
    });
});

experiment('insert base records', () => {

    test('insert rec 123', (done) => {

        const options = {
            method: 'POST',
            url: '/customers',
            payload: Customer_123
        };

        server.inject(options, (res) => {

            expect(res.statusCode).to.equal(200);
            done();
        });

    });

    test('insert rec 124', (done) => {

        const options = {
            method: 'POST',
            url: '/customers',
            payload: Customer_124
        };

        server.inject(options, (res) => {

            expect(res.statusCode).to.equal(200);
            done();
        });

    });

    test('insert rec 125', (done) => {

        const options = {
            method: 'POST',
            url: '/customers',
            payload: Customer_125
        };

        server.inject(options, (res) => {

            expect(res.statusCode).to.equal(200);
            done();
        });

    });
});
experiment('Positive Tests', () => {

    test('get a single customers', (done) => {

        const options = {
            method: 'GET',
            url: '/customers/123'
        };

        server.inject(options, (res) => {

            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    test('get a no hit customers', (done) => {

        const options = {
            method: 'GET',
            url: '/customers/999'
        };

        server.inject(options, (res) => {

            expect(res.statusCode).to.equal(404);
            done();
        });
    });

    test('get customers', (done) => {

        const options = {
            method: 'GET',
            url: '/customers'
        };

        server.inject(options, (res) => {

            expect(res.statusCode).to.equal(200);
            done();
        });
    });
});
