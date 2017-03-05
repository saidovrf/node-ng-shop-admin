(function () {
	'use strict';
	
	angular.module('ngShopAdmin', [])

	.controller('CommonCtrl', ['$scope', '$http', CommonCtrl]);

	function CommonCtrl($scope, $http){
		var vm = this;

		$http({
		  method: 'GET',
		  url: '/products'
		}).then(function successCallback(response) {
			console.log(response)
		}, function errorCallback(response) {

		});
	}
}());