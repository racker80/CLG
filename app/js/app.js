
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
	.when('/reset', {
		resolve: {
			reset: function($http){
				$http.get('data.php');
				return true;
			},
		}
	})

};
var App = angular.module('App', ['ui.bootstrap', 'ngResource', 'ngSanitize']).config(appConfig);



var appCtrl = App.controller('AppCtrl', function($scope, $q, Catalogue, $route){
	$scope.catalogue = Catalogue;

})

appCtrl.loadData = function($q, $http, $route, Catalogue) {
	var defer = $q.defer();
	$http.get('app/api/get-guides.php').success(function(data){
		Catalogue.guides = data;
		Catalogue.guide = Catalogue.guides[$route.current.params.guideIndex];
		defer.resolve();
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
	
	var page = $q.defer();
	$http.get('app/view/templates/page.html').success(function(data){
		Catalogue.templates['page'] = data;
		page.resolve(data);
	});	
	
	return {
		none:'',
		page: page.promise,
		chapter: chapter.promise,
		book: book.promise
	}
}








App.factory('Catalogue', function($http, $route, $routeParams, $q){
	return {
		guides: [],
		guide: {},
		saveGuide: function(){
			this.guide.id = this.guide._id.$id;
			$http.get('app/api/save-guide.php', {
				params:{
					json:angular.toJson(this.guide)
				}
			});
		},
		newGuide: function(){
			var newGuide = $q.defer();

			$http.get('app/api/add-guide.php', {
				params:this.structure.guide
			}).success(function(data){
				data.id = data._id.$id;
				newGuide.resolve(data);
			});

			this.guides.push(newGuide.promise)
			console.log(this.guides);

		},
		deleteGuide: function(){

		},
		edit: {},
		copy:{},
		templates:{},
		savePage: function() {
			if(this.edit.type ==  'page') {
				$http.get('app/api/save-page.php', {
					params:{
						json:angular.toJson(this.edit)
					}
				}).success(function(data){
					console.log(data)
				});
			}
		},
		structure: {
			guide: {
				title:"New Guide",
				type: "guide",
				id:{},
				books: {}
			},
			book: {
				title:"New Book",
				type:"book",
				chapters:{}
			},
			chapter: {
				title:"New Chapter",
				type:"chapter",
				pages:{}
			},
			page: {
				title:"New Page",
				type:"page",
				code:{},
				images:{},
				meta:{}
			}

		}
	}
});


App.directive('pageContent', function($http, $q){
	return {
		restrict:"AE",
		scope: {
			pageContent:"="
		},
		link: function(scope, element, attrs) {
			var content = $q.defer();
			$http.get('app/api/get-page.php', {params:{
				ref:'content',
				id:scope.pageContent.id
			}}).success(function(data){
				data.id = data._id.$id;
				content.resolve(data);
			});

			scope.page = content.promise;
		}
	}
});


App.directive('clgEditor', function($templateCache, $compile, Catalogue) {
	return {
		scope: {},
		controller: function($scope, $element, $attrs, $http) {
			$scope.catalogue = Catalogue;

		},
		link: function($scope, $element, $attrs, controller) {
			
			//RECOMPLE THE TEMPLATE ON NEW EDIT ITEM
			
			$scope.$on('editItem', function(){

				var type = $scope.catalogue.edit.type;

				var templates = $scope.catalogue.templates;
				$element.html(templates[type]);

				$compile($element.contents())($scope);
				$scope.$apply();

				console.log($scope)
			});

		}
	}
});
App.directive('codeBrowser', function(){
	return {
		scope:{
			codeBrowser:"="
		},
		template:'<pre ng-repeat="code in codeBrowser">{{code}}</pre>',
		link:function(scope, element, attrs) {
		}
	}
})
App.directive('ImageBrowser', function(){
	return {
		scope:{
			imageBrowser:"="
		},
		template:'<div class="imagePreview" ng-repeat="image in imageBrowser"><img src="{{image.url}}"></div>',
		link:function(scope, element, attrs) {
		}
	}
})
App.directive('clgUploadContainer', function($rootScope, $http, Catalogue){
	function link(scope, element, attrs) {

		scope.$watch('image', function(image){
			if(angular.isDefined(image)) {
				console.log(image)

				var input = {
					files:[]
				};
				
				input.files.push(image.file);
				
				var upload = new uploader(input, {
					url:'app/api/cloudFilesUpload.php',
					progress:function(ev){ console.log('progress'); },
					error:function(ev){ console.log(ev); },
					success:function(data){ 

						var data = angular.fromJson(data);

						console.log(data);


						Catalogue.edit.images.push(data);

					}
				});

				upload.send();

			}
		});
	}
	return {
		restrict: 'A',
		scope: {},
		link:link
	};
});


App.directive('editItem', function(Catalogue, $rootScope){
	return {
		scope: {
			item:'='
		},
		link: function(scope, element, attrs, clgEditorCtrl){
			element.bind('click', function(){
				Catalogue.saveGuide();
				Catalogue.savePage();
				Catalogue.edit = scope.item;

				$rootScope.$broadcast('editItem');
			});
		}
	}
});



App.directive('globalNav', function(Catalogue){
	return {
		restrict:"AE",
		scope: {},
		templateUrl:'app/view/includes/globalnav.php',
		link: function(scope) {
			scope.catalogue = Catalogue;
		}
	}
})











