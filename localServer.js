'use strict';

const Glue     = require('glue');
const Labbable = require('labbable');
const labbable = module.exports = new Labbable();


const options = {
    relativeTo: __dirname
};

const dbOptions = {
    url: 'mongodb://localhost:27017/test',
    settings: {
        poolSize: 10
    },
    decorate: true
};

const manifest = {
    'connections': [
        {
            'port': 3000,
            'labels': ['api'],
            'host': 'localhost'
        }
    ],
    'registrations': [
        {
            'plugin': {
                'register': '.'
            }
        },
        {
            'plugin': {
                'register': 'hapi-mongodb',
                'options': dbOptions
            }

        },
        {
            'plugin': {
                'register': 'vision'
            }
        },
        {
          'plugin': {
              'register': 'inert'
          }
        },
        {
            'plugin': {
                'register': 'hapi-swagger'
            }

        },
        {
            'plugin': {
                'register': 'blipp'
            }
        }
    ]
};

/* $lab:coverage:off$ */

Glue.compose(manifest, options, (err, server) => {

    if (err) {
        throw err;
    }

    // Step 2.
    // Show the server to our instance of labbable
    labbable.using(server);

    server.initialize((err) => {

        if (err) {
            throw err;
        }

        // Don't continue to start server if module
        // is being require()'d (likely in a test)
        if (module.parent) {
            return;
        }

        server.start((err) => {

            if (err) {
                throw err;
            }
            console.log('Server running at: ' + server.info.uri);
            //API Running on port 3000
        });
    });
});

/* $lab:coverage:on$ */
