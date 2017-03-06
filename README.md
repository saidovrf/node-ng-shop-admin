# AngularJS Shop Admin Panel on Node.js and Sails

Application at [Node.js](https://nodejs.org/), [Sails](http://sailsjs.org) and [sails-mongo](https://www.npmjs.com/package/sails-mongo) on the backend; [AngularJS](http://angularjs.org/), [JQuery](http://jquery.com) and [Twitter Bootstrap v4](https://v4-alpha.getbootstrap.com) on the frontend.

You can create or delete categories and products and also change products.

If you delete some category with linked products - this products will be distributed to 'No name' category automaticly.
You can't delete 'No name' category.

For starting server
```sh
$ sails lift
```

You can also can test this app right now on [Heroku](https://node-ng-shop-admin.herokuapp.com)
