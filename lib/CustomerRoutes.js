'use strict';


const Boom = require('boom');


class CustomerRoutes {
    getAll(request, reply) {

        const db = request.mongo.db;

        db.collection('customers').find({}, (err, doc) => {

            if (err) {
                return reply(Boom.wrap(err, 'Internal error'));
            }

            if (!doc) {
                return reply(Boom.notFound());
            }

            reply(doc.toArray());   //a find will return a cursor and we need to convert it to an array
        });

    };

    getByID(request, reply) {

        const db = request.mongo.db;

        db.collection('customers').findOne({ id: request.params.id }, (err, doc) => {

            if (err) {
                return reply(Boom.wrap(err, 'Internal error'));
            }

            if (!doc) {
                return reply(Boom.notFound());
            }

            reply(doc);
        });
    };

    addCustomer(request, reply) {

        const db      = request.mongo.db;
        const payload = request.payload;

        db.collection('customers').insertOne(payload, (err, doc) => {

            if (err) {
                return reply(Boom.wrap(err, 'Internal error'));
            }

            return reply(doc);
        });
    };
}
module.exports = CustomerRoutes;
