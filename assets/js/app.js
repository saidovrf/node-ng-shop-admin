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

		vm.doProduct = doProduct;

		vm.newProduct = newProduct;
		vm.newCategory = newCategory;

		vm.changeProduct = changeProduct;
		vm.changeCategory = changeCategory;


		function _clone(obj) {
		    if (null == obj || "object" != typeof obj) return obj;
		    var copy = obj.constructor();
		    for (var attr in obj) {
		        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		    }
		    return copy;
		}

		function changeProduct(key) {
			vm.product = _clone(vm.products[key]);
			vm.product.change = true;
			vm.product.key = key;

			vm.product.category = (vm.products[key].category) ? vm.products[key].category.id : '0';
			vm.product.oldCategory = vm.product.category;

			$('#productModal').modal('toggle');
		}

		function changeCategory(key) {
			
		}

		function doProduct(operation) {
			if (vm.product.name.split(' ').join('').length === 0) {
				alert('Введите название'); return;
			}
			if (vm.product.price_main <= 0 || vm.product.price <= 0) {
				alert('Значение любой стоимости должно быть выше 0'); return;
			}

			$('#productModal').modal('toggle');

			if (vm.product.category === '0') {
				vm.product.category = null;
			}

			switch (operation) {
				case 'create':
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
					break;
				case 'change':
					var key = vm.product.key;

					delete vm.product.key;
					delete vm.product.change;
					delete vm.product.oldCategory;

					HTTP.put('/products/' + vm.product.id, vm.product, function(response) {
						vm.categoriesCount[vm.product.oldCategory]--;

						if (response.category) {
							vm.categoriesCount[response.category.id]++;
						} else {
							vm.categoriesCount["0"]++;
						}

						vm.products[key] = response;

						vm.product = {
							name: '',
							price_main: 0,
							price: 0,
							category: '0'
						};
					})
					break;

			}
		}


		function newProduct() {
			
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