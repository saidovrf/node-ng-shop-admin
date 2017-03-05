module.exports.connections = {
 
  localMongoDb: {
    adapter: 'sails-mongo',
    host: 'ds119020.mlab.com', // defaults to `localhost` if omitted 
    port: 19020, // defaults to 27017 if omitted 
    user: 'heroku_ng-shop-admin', // or omit if not relevant 
    password: 'heroku_ng-shop-admin', // or omit if not relevant 
    database: 'heroku_kfk5fpw8' // or omit if not relevant 
  }
 
};