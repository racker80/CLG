
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
		controller: 'AppCtrl',
		templateUrl: 'app/view/guides.php'
	})
	.when('/:guideIndex', {
		controller: 'AppCtrl',
		templateUrl: 'app/view/guide.php',
		resolve: {
			guides: appCtrl.loadData
		}
	})

};
var App = angular.module('App', ['ui.bootstrap', 'ngResource', 'ngSanitize']).config(appConfig);



var appCtrl = App.controller('AppCtrl', function($scope, $route, $routeParams, $q, Catalogue){
	// console.log($route);
	Catalogue.guides;
})

appCtrl.loadData = function($q, $http) {
	var defer = $q.defer();
	$http.get('app/api/get-guides.php').success(function(data){
		defer.resolve(data);
	})
	return defer.promise;
}

App.factory('Catalogue', function($route, $routeParams){
	 var guides = $route.current.locals.guides;
	 var guide = guides[$routeParams.guideIndex];
	return {
		guides: function() {
			console.log('test')
			 return this.guides;
		},
		guide: function() {
			return this.guide;
		}
	}

});