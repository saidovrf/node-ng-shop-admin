(function () {
	'use strict';
	
	angular.module('ngShopAdmin')


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

		vm.changeProduct = changeProduct;
		vm.doProduct = doProduct;
		vm.removeProduct = removeProduct;
		vm.removeProductConfirm = removeProductConfirm;

		vm.newCategory = newCategory;
		vm.removeCategory = removeCategory;
		vm.removeCategoryConfirm = removeCategoryConfirm;

		
		function _cloneObject(obj) {
		    if (null == obj || "object" != typeof obj) return obj;
		    var copy = obj.constructor();
		    for (var attr in obj) {
		        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		    }
		    return copy;
		}

		function changeProduct(key) {
			vm.product = _cloneObject(vm.products[key]);
			vm.product.change = true;
			vm.product.key = key;

			vm.product.category = (vm.products[key].category) ? vm.products[key].category.id : '0';
			vm.product.oldCategory = vm.product.category;

			$('#productModal').modal('toggle');
		}

		function removeCategory() {
			HTTP.delete('/categories/' + vm.category.id, function(response) {
				vm.categoriesCount["0"] += vm.categoriesCount[vm.categories[vm.category.key].id];
				
				vm.categories.splice(vm.categoriesCount[vm.categories[vm.category.key].id], 1);;
				vm.categories.splice(vm.category.key, 1);

				$('#removeCategory').modal('toggle');

				vm.category = {
					name: ''
				};
			})
		}

		function removeProduct() {
			var key = vm.product.key;

			console.log('ff')

			HTTP.delete('/products/' + vm.product.id, function(response) {
				$('#removeProduct').modal('toggle');

				if (vm.product.category) {
					vm.categoriesCount[vm.product.category.id]--;
				} else {
					vm.categoriesCount["0"]--;
				}

				vm.products.splice(key, 1);

				vm.product = {
					name: '',
					price_main: 0,
					price: 0,
					category: '0'
				};
			})
		}

		function removeCategoryConfirm(key) {
			vm.category = _cloneObject(vm.categories[key]);
			vm.category.key = key;
			$('#removeCategory').modal('toggle');
		}

		function removeProductConfirm(key) {
			vm.product = _cloneObject(vm.products[key]);
			vm.product.key = key;
			$('#removeProduct').modal('toggle');
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
					var oldCategory = vm.product.oldCategory;

					delete vm.product.key;
					delete vm.product.change;
					delete vm.product.oldCategory;

					HTTP.put('/products/' + vm.product.id, vm.product, function(response) {
						vm.categoriesCount[oldCategory]--;

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