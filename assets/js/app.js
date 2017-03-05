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

	.controller('CommonCtrl', ['$scope', 'HTTP', CommonCtrl]);

	function CommonCtrl($scope, HTTP){
		var vm = this;

		vm.products = [];
		vm.categories = [];
		vm.categoriesCount = [];

		vm.product = {
			name: '',
			price_main: 0,
			price: 0,
			category: '0'
		};

		vm.category = {
			name: ''
		};

		vm.newProduct = newProduct;
		vm.newCategory = newCategory;


		function newProduct() {
			if (vm.product.name.split(' ').join('').length === 0) {
				alert('Введите название'); return;
			}
			if (vm.product.price_main <= 0 || vm.product.price <= 0) {
				alert('Значение любой стоимости должно быть выше 0'); return;
			}

			$('#createProduct').modal('toggle');

			if (vm.product.category === '0') {
				delete vm.product.category;
			}

			HTTP.post('/products', vm.product, function(response) {
				vm.products.push(response);

				if (response.category) {
					vm.categoriesCount[response.category]++;
				} else {
					vm.categoriesCount["0"]++;
				}

				vm.product = {
					name: '',
					price_main: 0,
					price: 0,
					category: '0'
				};
			})
		}

		function newCategory() {

			if (vm.category.name.split(' ').join('').length === 0) {
				alert('Введите название'); return;
			}

			$('#createCategory').modal('toggle');

			HTTP.post('/categories', vm.category, function(response) {
				vm.categories.push(response);

				vm.categoriesCount[response.id] = 0;

				vm.category = {
					name: ''
				};
			})
		}

		// $scope.$on('products_changed', function(e, d) {
		// 	vm.products = d;
		// })
		// $scope.$on('categories_changed', function(e, d) {
		// 	vm.categories = d;
		// })

		HTTP.get('/categories', function(response) {
			vm.categories = [{
				name: 'Без названия',
				id: '0'
			}];
			vm.categories = vm.categories.concat(response);

			for (var i = 0; i < vm.categories.length; i++) {
				vm.categoriesCount[vm.categories[i].id] = 0;
			}

			HTTP.get('/products', function(response) {
				vm.products = response;
				
				vm.categoriesCount["0"] = 0;

				for (var i = 0; i < vm.products.length; i++) {
					if (vm.products[i].category) {
						vm.categoriesCount[vm.products[i].category.id]++;
					} else {
						vm.categoriesCount["0"]++;
					}
				}
			});
		});
	}
}());