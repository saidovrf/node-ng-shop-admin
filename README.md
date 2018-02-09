# AngularJS Shop Admin Panel on Node.js and Sails

> For now after latest commits for redesign - there is no functionality to manipulate with products and categories.
> You can test it in older version (link in the bottom of description).

Application at [Node.js](https://nodejs.org/), [Sails](http://sailsjs.org) and [sails-mongo](https://www.npmjs.com/package/sails-mongo) on the backend; [AngularJS](http://angularjs.org/), [JQuery](http://jquery.com) and [Twitter Bootstrap v4](https://v4-alpha.getbootstrap.com) on the frontend.

You can create or delete categories and products and also change products and they will be host on your computer in Local Storage.


If you delete some category with linked products - this products will be distributed to 'No name' category automaticly.
You can't delete 'No name' category.

For starting server
```sh
$ sails lift
```
or 
```sh
$ npm start
```

You can also can test this app right now on [Heroku](https://node-ng-shop-admin.herokuapp.com) (old version)
