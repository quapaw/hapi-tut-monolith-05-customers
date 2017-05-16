# Breaking the Monolith by using hapi 
## Background
Let me get the disclaimer out of the way: I am not an expert on Hapi
I started looking into Hapi's ability to break components out.
This is my attempt to follow other tutorials from a hello world to a true component system.
I have broken this down into the following steps

| Project  | Description | Link |
|---|---|---|
|hapi-tut-monolith-01|A simple hello world hapi project| [01](https://github.com/quapaw/hapi-tut-monolith-01)|
|hapi-tut-monolith-02a|Add services - customers and products| [02A](https://github.com/quapaw/hapi-tut-monolith-02a)|
|hapi-tut-monolith-02b|Adding Glue and externalizing config| [02B](https://github.com/quapaw/hapi-tut-monolith-02b)|
|hapi-tut-monolith-02c|Moving services into their own folders| [02C](https://github.com/quapaw/hapi-tut-monolith-02c)|
|hapi-tut-monolith-03-main|Moved service into own project. Instructions here| [03-main](https://github.com/quapaw/hapi-tut-monolith-03-main)|
|hapi-tut-monolith-03-customer|Just the customer service| [03-customers](https://github.com/quapaw/hapi-tut-monolith-03-customers)|
|hapi-tut-monolith-03-products|Just the produce service| [03-products](https://github.com/quapaw/hapi-tut-monolith-03-products)|
|hapi-tut-monolith-04a-customer|Movement of some files| [04a-customers](https://github.com/quapaw/hapi-tut-monolith-04a-customers)|
|hapi-tut-monolith-04b-customer|New methods| [04b-customers](https://github.com/quapaw/hapi-tut-monolith-04b-customers)|
|hapi-tut-monolith-04c-customer|Validation and Error Handling|[04c-customers](https://github.com/quapaw/hapi-tut-monolith-04c-customers)|
|hapi-tut-monolith-04d-customer|Unit Testing|[04d-customers](https://github.com/quapaw/hapi-tut-monolith-04d-customers)|
|**hapi-tut-monolith-04e-customer**|**Add Mongo and API Docu**|**[04e-customers](https://github.com/quapaw/hapi-tut-monolith-04e-customers)**|


#HAPI Tutorial - Monolith - 4 - Move toward production
This part of the tutorial will move the customer plugin more toward a production plugin.
This step, 04e, will add mongo and api documentation.

* To add mongo we will utilize hapi-mongodb
    The github project for hapi-mongodb is here (https://github.com/Marsup/hapi-mongodb)
    
* To add API Documentation we will use hapi-swagger
    The github project for hapi-swagger is here (https://github.com/glennjones/hapi-swagger)

    
## Adding mongodb to our project

* Add mongodb to package.json by running ```npm install hapi-mongodb --save```
* Add configuration and mongodb to hapi's startup
    * Add configuration definition to localServer.js
        
        ```javascript
        const dbOptions = {
            url: 'mongodb://localhost:27017/test',
            settings: {
                poolSize: 10
            },
            decorate: true
        };
        ```
    * Add hapi-mongodb plugin to hapi registry in localServer.js
    
        ```javascript
        {
            'plugin': {
                'register': 'hapi-mongodb',
                'options': dbOptions
            }

        }
        ```
        The full manifest should look like
        ```javascript
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
        
                }
            ]
        };
        ```

    * You should have mongodb running on your development box
        If it is not running you may get an error that looks like the following 
        ```MongoError: failed to connect to server [localhost:27017] on first connect [MongoError: connect ECONNREFUSED 127.0.0.1:27017]```
    * Mongodb should not have any security setup at this time.
    
* Get access to mongo connection in CustomerRoutes.js
    * add database constant by adding the following code ```const db = request.mongo.db;```
    * change the read code to use mongo database connection
    
    ```javascript
    getByID(request, reply) {
        const db = request.mongo.db;
        const id = request.params.id;

        db.collection('customers').findOne({ id: id }, (err, doc) => {

            if (err) {
                return reply(Boom.wrap(err, 'Internal error'));
            }

            if (!doc) {
                return reply(Boom.notFound());
            }

            reply(doc);
        });
    };
    ```
    
    * look at the full CustomerRoutes.js to see the changes to the code
    * TestCustomer.js was change to prime the database
        * Code was added in the before block to delete the customers collection so it would be at the same starting point every time the test is ran
        * A new set of tests have been added to insert the three test records before any of the other tests run.
        
        
## Adding API Documentation to project
* You can utilize hapi-swagger to build documentation
    * Run the following to install hapi-swagger and two dependencies ```npm install hapi-swagger vision inert --save```
* You can also utilize blipp to print out all the exposed endpoints on startup
    * Run the following to install blipp ```npm install blipp --save```
* You will need to add these to your manifest.
    Normally these would be added in your master project and not your service endpoints
    
    ```
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
    ```
 
* Add a tag in your endpoint configuration to mark the endpoint as a public api in index.js  ```tags: ['api'],```
    Your index configuration will look like the following
    
    ```
    server.route({
        method: 'GET',
        path:   '/customers/{id}',
        handler: routes.getByID,
        config: {
            tags: ['api'],
            validate: {
                params: { id: Joi.number().integer() },
                query:  false,
                payload: false,
                options: { allowUnknown: false }
            }
        }
    });
    ```
    
* When you startup you will see the following out from blipp

    ```
    http://localhost:3000 [api]
      GET    /customers                     
      POST   /customers                     
      GET    /customers/{id}                
      GET    /documentation                 
      GET    /swagger.json                  
      GET    /swaggerui/{path*}             
      GET    /swaggerui/extend.js           
    
    Server running at: http://localhost:3000
    ```
    
* You can go out to the documentation url to see the endpoints (http://localhost:3000/documentation)