
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
		templateUrl: '/app/view/guides.php'
	})
	.when('/reset', {
		controller: '',
		templateUrl: '/data.php'
	})
	.when('/guides/:guideSlug', {
		controller: 'GuidesController',
		templateUrl: '/app/view/guides-detail.php'
	})
	.when('/guides/:guideSlug/books/:bookSlug', {
		controller: 'GuidesController',
		templateUrl: '/app/view/book-detail.php'
	})
	.when('/guides/:guideSlug/books/:bookSlug/chapters/:chapterSlug', {
		controller: 'GuidesController',
		templateUrl: '/app/view/chapter-detail.php'
	})
	.when('/guides/:guideSlug/books/:bookSlug/chapters/:chapterSlug/edit', {
		controller: 'GuidesController',
		templateUrl: '/app/view/chapter-edit.php'
	})
	.when('/guides/:guideSlug/books/:bookSlug/chapters/:chapterSlug/pages/:pageIndex', {
		controller: 'PageDetailController',
		templateUrl: '/app/view/page-detail.php'
	});
};
var App = angular.module('App', ['ui.bootstrap', 'ngResource']).config(appConfig);

// App.run(function($rootScope) {
//         $rootScope.changeIndex = function(array, index) {
            
//         	array.splice(index, 0, array.splice(index, 1)[0]);
        	
        	
//         };
//     });