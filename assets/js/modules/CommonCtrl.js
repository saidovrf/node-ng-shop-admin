(function () {
	'use strict';
	
	angular.module('ngShopAdmin')


	.controller('CommonCtrl', ['$scope', 'HTTP', 'Alert', CommonCtrl]);

	function CommonCtrl($scope, HTTP, Alert){
		var vm = this;

		document.querySelector('.loading-init').classList.remove("loading-init");

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

		vm.createProduct = createProduct;
		vm.createCategory = createCategory;

		vm.changeProduct = changeProduct;

		vm.deleteProduct = deleteProduct;
		vm.deleteCategory = deleteCategory;


		/************************************************************************/
		/* 		Private functions 												*/
		/************************************************************************/
		function _cleanProductFields() {
			vm.product = {
				name: '',
				price_main: 0,
				price: 0,
				category: '0'
			};
		}
		function _cleanCategoryFields() {
			vm.category = {
				name: ''
			};
		}
		function _cloneObject(obj) {
		    if (null == obj || "object" != typeof obj) return obj;
		    var copy = obj.constructor();
		    for (var attr in obj) {
		        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		    }
		    return copy;
		}





		/************************************************************************/
		/* 		Creating functions 												*/
		/************************************************************************/
		function createProduct() {
			_cleanProductFields();

			Alert.showPrompt('Добавить товар', {create: true, type: 'product'}, function() {
				if (vm.product.name.split(' ').join('').length === 0) {
					Alert.showPromptErrorMessage('Введите название товара'); return;
				}
				if (vm.product.price_main <= 0 || vm.product.price <= 0) {
					Alert.showPromptErrorMessage('Значение любой стоимости должно быть выше 0'); return;
				}

				if (vm.product.category === '0') {
					vm.product.category = null;
				}

				HTTP.post('/products', vm.product, function(response) {
					vm.products.push(response);

					if (response.category) {
						vm.categoriesCount[response.category]++;
					} else {
						vm.categoriesCount["0"]++;
					}

					Alert.hidePrompt();

					_cleanProductFields();
				}, function(response) {
					Alert.showPromptErrorMessage('<strong>' + response.status + '</strong> ' + response.data.details);
				})
				
			});
		}
		function createCategory() {
			_cleanCategoryFields();

			Alert.showPrompt('Добавить категорию', {create: true, type: 'category'}, function() {
				if (vm.category.name.split(' ').join('').length === 0) {
					Alert.showPromptErrorMessage('Введите название'); return;
				}

				HTTP.post('/categories', vm.category, function(response) {
					vm.categories.push(response);

					vm.categoriesCount[response.id] = 0;

					Alert.hidePrompt();
					_cleanCategoryFields();
				}, function(response) {
					Alert.showPromptErrorMessage('<strong>' + response.status + '</strong> ' + response.data.details);
				});
				
			});
		}

		

		/************************************************************************/
		/* 		Change product function 										*/
		/************************************************************************/
		function changeProduct(key) {
			var oldCategory;

			_cleanProductFields();

			vm.product = _cloneObject(vm.products[key]);
			vm.product.category = (vm.products[key].category) ? vm.products[key].category.id : '0';
			oldCategory = vm.product.category;

			Alert.showPrompt('Изменить товар', {change: true, type: 'product'}, function() {
				
				if (vm.product.name.split(' ').join('').length === 0) {
					Alert.showPromptErrorMessage('Введите название товара'); return;
				}
				if (vm.product.price_main <= 0 || vm.product.price <= 0) {
					Alert.showPromptErrorMessage('Значение любой стоимости должно быть выше 0'); return;
				}

				if (vm.product.category === '0') {
					vm.product.category = null;
				}

				HTTP.put('/products/' + vm.product.id, vm.product, function(response) {
					vm.categoriesCount[oldCategory]--;

					if (response.category) {
						vm.categoriesCount[response.category.id]++;
					} else {
						vm.categoriesCount["0"]++;
					}

					vm.products[key] = response;

					Alert.hidePrompt();
					_cleanProductFields();
				}, function(response) {
					Alert.showPromptErrorMessage('<strong>' + response.status + '</strong> ' + response.data.details);
				})
				
			});
		}


		/************************************************************************/
		/* 		Removing functions 												*/
		/************************************************************************/
		function deleteCategory(key) {
			Alert.showConfirm('Удалить категорию', 'Вы действительно хотите удалить эту категорию?<br>Все товары будут перенесены в категорию "Без названия"', function() {
				var category = vm.categories[key];

				HTTP.delete('/categories/' + category.id, function(response) {
					vm.categoriesCount["0"] += vm.categoriesCount[category.id];
					
					delete vm.categoriesCount[category.id];
					vm.categories.splice(key, 1);

					Alert.hideConfirm();
				}, function(response) {
					Alert.showConfirmErrorMessage('<strong>' + response.status + '</strong> ' + response.data.details);
				})
			});
		};
		function deleteProduct(key) {
			Alert.showConfirm('Удалить товар', 'Вы действительно хотите удалить этот товар?', function() {
				var product = vm.products[key];

				HTTP.delete('/products/' + product.id, function(response) {
					if (product.category) {
						vm.categoriesCount[product.category.id]--;
					} else {
						vm.categoriesCount["0"]--;
					}

					vm.products.splice(key, 1);

					Alert.hideConfirm();
				}, function(response) {
					Alert.showConfirmErrorMessage('<strong>' + response.status + '</strong> ' + response.data.details);
				})
			});
		};

		// function changeProduct(key) {
		// 	vm.product = _cloneObject(vm.products[key]);
		// 	vm.product.change = true;
		// 	vm.product.key = key;

		// 	vm.product.category = (vm.products[key].category) ? vm.products[key].category.id : '0';
		// 	vm.product.oldCategory = vm.product.category;

		// 	$('#productModal').modal('toggle');
		// }

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

			document.querySelector('.col-md-4 .loading-back').classList.remove("loading-back");
			document.querySelector('.col-md-4 .loading-padding').classList.remove("loading-padding");

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

				document.querySelector('.col-md-8 .loading-back').classList.remove("loading-back");
				document.querySelector('.col-md-8 .loading-padding').classList.remove("loading-padding");
			});
		});
	}
}());