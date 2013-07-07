
// angular.module('phonecat', ['phonecatServices']).
//   config(['$routeProvider', function($routeProvider) {
//   $routeProvider.
//       when('/guides', {templateUrl: 'app/partials/guides-list.php',   controller: PhoneListCtrl}).
//       when('/guides/:slug', {templateUrl: 'app/partials/guides-detail.php',   controller: PhoneDetailCtrl}).

//       when('/phones', {templateUrl: 'app/partials/phone-list.html',   controller: PhoneListCtrl}).
//       when('/phones/:phoneId', {templateUrl: 'app/partials/phone-detail.html', controller: PhoneDetailCtrl}).
//       otherwise({redirectTo: '/phones'});
// }]);


var appConfig = function($routeProvider) {
	$routeProvider
	.when('/', {
		controller: 'GuidesController',
		templateUrl: 'app/view/guides.php'
	})
	.when('/content', {
		controller: 'ContentController',
		templateUrl: 'app/view/content.php'
	})
	.when('/reset', {
		controller: '',
		templateUrl: './data.php'
	})
	.when('/:guideIndex', {
		controller: 'MainController',
		templateUrl: 'app/view/guide.php'
	})

};
var App = angular.module('App', ['ui.bootstrap', 'ngResource', 'ngSanitize', 'imageupload']).config(appConfig);

// App.run(function($rootScope) {
//         $rootScope.changeIndex = function(array, index) {
            
//         	array.splice(index, 0, array.splice(index, 1)[0]);
        	
        	
//         };
//     });