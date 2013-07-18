
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
		templateUrl: 'app/view/index.php',
		resolve: {
			guides: appCtrl.loadData,
			templates: appCtrl.loadTemplates
		}
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
var App = angular.module('App', ['ui.bootstrap', 'ui.sortable', 'ngResource', 'ngSanitize', 'imageupload']).config(appConfig);



var appCtrl = App.controller('AppCtrl', function($scope, $q, Catalogue, $route, $routeParams){
	$scope.catalogue = Catalogue;
	$scope.routeParams = $routeParams;

	$scope.sortableOptions = {
		start: function(e, ui) {
	    	// console.log(ui.item)

		},
		stop: function(e, ui) {
			// console.log()
	    	$scope.catalogue.saveGuide();

		},
	    update: function(e, ui) {
	    },
	    
	};
	console.log($scope);
})

/************************************************************************
************************************************************************
DATA LOADING
************************************************************************
************************************************************************/


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

	var guide = $q.defer();
	$http.get('app/view/templates/guide.html').success(function(data){
		Catalogue.templates['guide'] = data;
		page.resolve(data);
	});		
	
	return {
		none:'',
		page: page.promise,
		chapter: chapter.promise,
		book: book.promise,
		guide: guide.promise
	}
}







/************************************************************************
************************************************************************
THE CATALOGUE
************************************************************************
************************************************************************/

App.factory('Catalogue', function($rootScope, $http, $route, $routeParams, $location, $q){
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
		newGuide: function(edit){
			var newGuide = $q.defer();
			$http.get('app/api/add-guide.php', {
				params:{
					json:angular.toJson(this.structure.guide)
				}
			}).success(function(data){
				data.id = data._id.$id;
				newGuide.resolve(data);
			});

			this.guides.push(newGuide.promise)
			console.log(this.guides);
			
			if(edit == false) {
				return
			}

			var index = this.guides.length-1;
			$location.path('/'+index);
	


		},
		deleteGuide: function(){

		},
		edit: {},
		copy:{},
		copyItem: function(item){
			this.copy = item;
			$rootScope.$broadcast('itemCopied');
		},
		templates:{},
		savePage: function() {
			if(this.edit.type ==  'page') {
				$http.get('app/api/save-page.php', {
					params:{
						json:angular.toJson(this.edit)
					}
				}).success(function(data){
				});
			}
		},
		structure: {
			guide: {
				title:"New Guide",
				type: "guide",
				id:{},
				books:[]
			},
			book: {
				title:"New Book",
				type:"book",
				chapters:[]
			},
			chapter: {
				title:"New Chapter",
				type:"chapter",
				pages:[]
			},
			page: {
				title:"New Page",
				type:"page",
				code:[],
				images:[],
				meta:[]
			}

		}
	}
});


/************************************************************************
************************************************************************
THE INDEX
************************************************************************
************************************************************************/
App.directive('indexActions', function(Catalogue, $q, $http, $rootScope, $compile){
	return {
		restrict:"A",
		scope: {
			type:'@',
			edit:"=",
			location:"=",
			target:"=",
		},
		link: function(scope, element, attrs){
			scope.catalogue = Catalogue;
			scope.addGroupTo = function() {
				if(scope.type == 'paste') {
					scope.location.push(Catalogue.copy);
				} else {
					scope.location.push(Catalogue.structure[scope.type]);
				}
				Catalogue.saveGuide();

				//TODO DELETE GUIDE!

			}
			scope.removeFromGroup = function() {
				scope.location.splice(scope.target, 1);
				Catalogue.saveGuide();
			}
			scope.addNewPage = function() {
				$http.get('app/api/add-page.php', {params:{
					json:angular.toJson(Catalogue.structure.page)
				}}).success(function(data){
					data.id = data.$id.$id;
					data.type = 'page';
					scope.location.push(data);
					Catalogue.saveGuide();

				});				
			}
			scope.copy = function() {
				Catalogue.copy = scope.target;
				console.log(Catalogue.copy)
			}

		}
	}
})
App.directive('indexContainer', function($compile){
	return {
		restrict:"A",
		link:function(scope, element, attrs) {

			scope.$on('updateIndex', function(){
				// $compile(element.contents())(scope)
			})
		}
	}
});

/************************************************************************
************************************************************************
PAGE STUFF
************************************************************************
************************************************************************/

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



/************************************************************************
************************************************************************
EDITOR STUFF
************************************************************************
************************************************************************/
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
App.directive('codeAdder', function(Catalogue){
	return {
		restrict:"A",
		scope:{},
		template:'<textarea ng-model="newCode"></textarea><button ng-click="add()" class="btn">add</button>',
		link:function(scope, element, attrs) {
			scope.add = function() {
				Catalogue.edit.code.push(scope.newCode);
				Catalogue.saveGuide();
				Catalogue.savePage();
			}

		}
	}
})

App.directive('contentPreview', function(Catalogue){
	var converter = new Showdown.converter();

	return {
		restrict:"A",
		scope:{
			contentPreview:"="
		},
		link:function(scope, element, attrs){
			//GENERATE MARKDOWN AND CODE
			
			console.log(scope)
			var previewContent = function(){
				if(!angular.isDefined(scope.contentPreview)) {
					return;
				}
				scope.content = converter.makeHtml(scope.contentPreview);

				//REPLACE THE CODE
				angular.forEach(Catalogue.edit.code, function(value, key) {
					scope.content = scope.content.replace('[code '+key+']', '<pre>'+value+'</pre>');
				});
                //REPLACE THE IMAGES
                angular.forEach(Catalogue.edit.images, function(value, key) {
                	scope.content = scope.content.replace('[image '+key+']', '<img src="'+value.url+'">');
                });  				
			}

			scope.$watch('contentPreview', function(){
				previewContent();
			});

		}
	}
})

App.directive('editItem', function(Catalogue, $rootScope){
	return {
		scope: {
			item:'='
		},
		transclude:true,
		template:'<span ng-transclude></span>',
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

/************************************************************************
************************************************************************
UPLOADER STUFF
************************************************************************
************************************************************************/
App.directive('imageBrowser', function($compile){
	return {
		restrict:"A",
		scope:{
			imageBrowser:"="
		},
		link:function(scope, element, attrs) {
			if(scope.imageBrowser.length > 0) {
				element.html('<div class="imageContainer"><div class="imagePreview" ng-repeat="image in imageBrowser"><img src="{{image.url}}"></div></div>');
				$compile(element.contents())(scope);
				scope.$apply();
			}
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

						console.log(Catalogue);


						Catalogue.edit.images.push(data);
						scope.$apply();
						Catalogue.savePage();
						Catalogue.saveGuide();
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





/************************************************************************
************************************************************************
GLOBAL NAV
************************************************************************
************************************************************************/
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











