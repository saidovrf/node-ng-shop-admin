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
						// error aler
					}
					
				}, function errorCallback(response) {
					// error aler
				});

			}
		};
	}])

	.controller('CommonCtrl', ['$scope', 'HTTP', CommonCtrl]);

	function CommonCtrl($scope, HTTP){
		var vm = this;

		vm.defaultCategoryCount
		vm.products = [];
		vm.categories = [];
		vm.categoriesCount = [];
		
		HTTP.get('/categories', function(response) {
			vm.categories = response;

			HTTP.get('/products', function(response) {
				vm.products = response;
				vm.categoriesCount["0"] = 0;

				for (var i = 0; i < vm.products.length; i++) {
					if (vm.products[i].category) {
						if (vm.categoriesCount[vm.products[i].category.id]) {
							vm.categoriesCount[vm.products[i].category.id]++;
						} else {
							vm.categoriesCount[vm.products[i].category.id] = 1;
						}
					} else {
						vm.categoriesCount["0"]++;
					}
				}
			});
		});
	}
}());