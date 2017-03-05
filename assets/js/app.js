(function () {
	'use strict';
	
	angular.module('ngShopAdmin', [])

	.factory('HTTP', ['$http', function($http){
		return {
			get: function(url, callback) {
				$http({
				  method: 'GET',
				  url: url
				}).then(function successCallback(response) {
					if (response.status === 200) {	
						callback(response.data);
					} else {
						// error alert
					}
				}, function errorCallback(response) {
					// error alert
				});

			},
			post: function(url, data, callback) {
				$http({
				  method: 'POST',
				  url: url,
				  data: data
				}).then(function successCallback(response) {
					if (response.status === 201) {
						callback(response.data)
					} else {
						// alert
					}
				}, function errorCallback(response) {
					if (response.status === 400 && response.data.code === "E_VALIDATION") {	
						alert('Заполните все обязательные поля')
					} else {
						// error alert
					}
				});

			},
			put: function(url, data, callback) {
				$http({
				  method: 'PUT',
				  url: url,
				  data: data
				}).then(function successCallback(response) {
					if (response.status === 200) {
						callback(response.data)
					}
				}, function errorCallback(response) {
					if (response.status === 400 && response.data.code === "E_VALIDATION") {	
						alert('Заполните все обязательные поля')
					} else {
						// error alert
					}
				});
				
			},
			delete: function(url, callback) {
				$http({
				  method: 'DELETE',
				  url: url
				}).then(function successCallback(response) {
					if (response.status === 200) {
						callback(response.data)
					}
				}, function errorCallback(response) {
					if (response.status === 400 && response.data.code === "E_VALIDATION") {	
						alert('Заполните все обязательные поля')
					} else {
						// error alert
					}
				});
				
			}
		};
	}])

	// .factory('Products', ['$rootScope', function($rootScope){
	// 	var _productsList = [];
	// 	return {
	// 		get: function() {
	// 			return _productsList;
	// 		},
	// 		set: function(value) {
	// 			_productsList = value;
	// 			$rootScope.$broadcast('products_changed', value);
	// 		}
	// 	};
	// }])

	// .factory('Categories', ['$rootScope', function($rootScope){
	// 	var _categoriesList = [];
	// 	return {
	// 		get: function() {
	// 			return _categoriesList;
	// 		},
	// 		set: function(value) {
	// 			_categoriesList = value;
	// 			$rootScope.$broadcast('categories_changed', value);
	// 		}
	// 	};
	// }])

}());