/**
 * Products.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	name: {
  		required: true,
  		type: 'string'
  	},
  	price_main: {
  		required: true,
  		type: 'float'
  	},
  	price: {
  		required: true,
  		type: 'float'
  	},
  	category: {
  		model: 'Categories'
  	}
  }
};

