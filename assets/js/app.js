(function () {
	'use strict';
	
	angular.module('ngShopAdmin', [])

	.filter('productsFilter', function() {
        return function(input, selected) {
        	var response = [];

        	for (var i = 0; i < input.length; i++) {
        		switch(selected) {
	            	case '':
	            		response = response.concat(input[i]); break;
	            	case '0':
	            		if (!input[i].category) response = response.concat(input[i]); break;
	            	default:
	            		if (input[i].category.id === selected) response = response.concat(input[i]); break;
	            }
        	}
            
            return response;
        }
    })

	.factory('Alert', function(){
		
		function _removeEvents(element) {
			var old_element = element;
			var new_element = old_element.cloneNode(true);
			old_element.parentNode.replaceChild(new_element, old_element);
			return new_element;
		}

		return {
			showConfirm: function(headText, bodyText, yesButtonCallback, noButtonCallback) {
				var that = this;
				var title = document.getElementById("confirm-title");
				var text = document.getElementById("confirm-text");

				var okayButton = _removeEvents(document.getElementById("confirm-ok"));
				var dismissButton = _removeEvents(document.getElementById("confirm-dismiss"));

				title.innerHTML = headText;
				text.innerHTML = bodyText;

				okayButton.addEventListener('click', function() {
					document.querySelector('#confirm .modal-content').className += ' loading-back';

					if (yesButtonCallback) {
						yesButtonCallback();
					}
				});
				
				dismissButton.addEventListener('click', function() {
					that.hideConfirm();

					if (noButtonCallback) {
						noButtonCallback();
					}
				});

				$('#confirm').modal({
					keyboard: false,
					backdrop: false
				});
			},
			showConfirmErrorMessage: function(message) {
				document.querySelector('#confirm .modal-content').classList.remove("loading-back");

				document.getElementById('confirm-message').innerHTML = message;
				document.getElementById('confirm-message').style.display = 'block';
			},
			hideConfirm: function() {
				if ( document.querySelector('#confirm .modal-content').classList.contains('loading-back') ) {
					document.querySelector('#confirm .modal-content').classList.remove("loading-back");
				}
				
				document.querySelector('#confirm .close').click();
			},
			showPrompt: function(headText, options, yesButtonCallback, noButtonCallback) {
				var that = this;

				document.getElementById('prompt-message').style.display = 'none';

				var title = document.querySelector("#prompt-title");

				var addButton = _removeEvents(document.getElementById("prompt-add"));
				var changeButton = _removeEvents(document.getElementById("prompt-change"));
				var cancelButton = _removeEvents(document.getElementById("prompt-cancel"));

				title.innerHTML = headText;

				if (options.create) {
					addButton.addEventListener('click', function() {
						document.querySelector('#prompt .modal-content').className += ' loading-back';

						if (yesButtonCallback) {
							yesButtonCallback();
						}
					});
					addButton.style.display = 'block';
					changeButton.style.display = 'none';
				}

				if (options.change) {
					changeButton.addEventListener('click', function() {
						document.querySelector('#prompt .modal-content').className += ' loading-back';

						if (yesButtonCallback) {
							yesButtonCallback();
						}
					});
					addButton.style.display = 'none';
					changeButton.style.display = 'block';
				}

				document.getElementById('prompt-body-product').style.display = 'none';
				document.getElementById('prompt-body-category').style.display = 'none';

				document.getElementById('prompt-body-' + options.type).style.display = 'block';

				cancelButton.addEventListener('click', function() {
					that.hidePrompt();

					if (noButtonCallback) {
						noButtonCallback();
					}
				});

				$('#prompt').modal({
					keyboard: false,
					backdrop: false
				});
			},
			showPromptErrorMessage: function(message) {
				document.querySelector('#prompt .modal-content').classList.remove("loading-back");

				document.getElementById('prompt-message').innerHTML = message;
				document.getElementById('prompt-message').style.display = 'block';
			},
			hidePrompt: function() {
				if ( document.querySelector('#prompt .modal-content').classList.contains('loading-back') ) {
					document.querySelector('#prompt .modal-content').classList.remove("loading-back");
				}
				
				document.querySelector('#prompt .close').click();
			},
		};
	})

	.factory('HTTP', ['$http', function($http){
		var doRequest = function(method, url, data, successCallback, errorCallback) {

			var options = {
			  	method: method,
			  	url: url
			};

			if (data !== null) {
				options.data = data
			}

			$http(
				options
			).then(function(response) {
				if (response.status === 200 || response.status === 201) {	
					successCallback(response.data);
				} else {
					if (errorCallback) {
						errorCallback(response)
					}
				}
			}, function(response) {
				if (errorCallback) {
					errorCallback(response)
				}
			});
		}

		return {
			get: function(url, successCallback, errorCallback) {
				doRequest('GET', url, null, successCallback, errorCallback);
			},
			post: function(url, data, successCallback, errorCallback) {
				doRequest('POST', url, data, successCallback, errorCallback);
			},
			put: function(url, data, successCallback, errorCallback) {
				doRequest('PUT', url, data, successCallback, errorCallback);				
			},
			delete: function(url, successCallback, errorCallback) {
				doRequest('DELETE', url, null, successCallback, errorCallback);
			}
		};
	}])

}());