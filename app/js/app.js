
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
			guides: appCtrl.loadData,
			templates: appCtrl.loadTemplates

		}
	})

};
var App = angular.module('App', ['ui.bootstrap', 'ngResource', 'ngSanitize']).config(appConfig);



var appCtrl = App.controller('AppCtrl', function($scope, $q, Catalogue){
	$scope.catalogue = Catalogue;
})

appCtrl.loadData = function($q, $http, $route, Catalogue) {
	var defer = $q.defer();
	$http.get('app/api/get-guides.php').success(function(data){
		Catalogue.guides = data;
		Catalogue.guide = Catalogue.guides[$route.current.params.guideIndex];
		defer.resolve(data);
	})
	return defer.promise;
}

appCtrl.loadTemplates = function($q, $http, $route, Catalogue) {
	var chapter = $q.defer();
	$http.get('app/view/templates/chapter.html').success(function(data){
		Catalogue.templates['chapter'] = data;
		chapter.resolve(data);
	});

	var book = $q.defer();
	$http.get('app/view/templates/book.html').success(function(data){
		Catalogue.templates['book'] = data;
		chapter.resolve(data);
	});
	
	return {
		chapter: chapter.promise,
		book: book.promise
	}
}

App.factory('Catalogue', function($http, $route, $routeParams){
	return {
		guides: [],
		guide: {},
		saveGuide: function(){
			console.log(angular.toJson(this.guide))
			this.guide.id = this.guide._id.$id;
			$http.get('app/api/save-guide.php', {
				params:{
					json:angular.toJson(this.guide)
				}
			});
		},
		newGuide: function(){
			
		},
		deleteGuide: function(){

		},
		edit: {},
		copy:{},
		templates:{}
	}
});



App.directive('clgEditor', function($templateCache, $compile, Catalogue) {
	return {
		scope: {},
		controller: function($scope, $element, $attrs, $http) {
			$scope.catalogue = Catalogue;

		},
		link: function($scope, $element, $attrs, controller) {
			
			$scope.$on('editItem', function(){
				var type = $scope.catalogue.edit.type;
				$element.html($scope.catalogue.templates[type]);

				console.log($scope.catalogue.templates[type])

				// $element.html('<editor-content></editor-content>');


				$compile($element.contents())($scope);
				$scope.$apply();
			});

		}
	}
});
App.directive('editorContent', function(Catalogue, $templateCache){
	return {
		scope:{},
		restrict:'E',
		require:"^clgEditor",
		// template:'<input type="text" ng-model="catalogue.edit.title"> <button class="btn btn-primary btn-small" ng-click="catalogue.saveGuide()">save</button>',
		// template:$templateCache.get('test'),
		link: function(scope, element, attrs, editorCtrl) {
			scope.catalogue = Catalogue;
			console.log($templateCache.get('test'));

		}
	}
});


App.directive('editItem', function(Catalogue, $rootScope){
	return {
		scope: {
			item:'='
		},
		link: function(scope, element, attrs, clgEditorCtrl){
			element.bind('click', function(){
				Catalogue.edit = scope.item;
				$rootScope.$broadcast('editItem');
			});
		}
	}
});













