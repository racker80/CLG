
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



var appCtrl = App.controller('AppCtrl', function($scope, $q, walkData, Catalogue, $route, $routeParams){
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



})
App.directive('sortableOptions', function(Catalogue){
	return {
		link:function(scope) {
			scope.sortableOptions = {
				start: function(e, ui) {
			    	// console.log(ui.item)

				},
				stop: function(e, ui) {
					// console.log()
			    	Catalogue.saveGuide();

				},
			    update: function(e, ui) {
			    },
			    
			};
		}
	}
})

App.run(function(Catalogue, walkData){

})

App.factory('walkData', function(Catalogue, $q, $http) {
	return {
		updatePage: function(page) {
			if(!Catalogue.pages[page.id]) {
				console.log(page.id)
				Catalogue.pages[page.id] = [];
			} else {
				page.content = Catalogue.pages[page.id];				
			}

			var content = $q.defer();
			$http.get('app/api/index.php', {params:{
				collection: 'content',
				action:'getPage',
				json: angular.toJson({
					ref:'content',
					id:page.id
				}),

			}}).success(function(data){
				data.id = data._id.$id;	

				Catalogue.updateImage(data);

				content.resolve(data);
			}).then(function(data){
				return content.promise;
			});

			Catalogue.pages[page.id] = content.promise;
			page.content = Catalogue.pages[page.id];


			console.log(page.content)
		},
		walk: function(){
			var ths = this;

			angular.forEach(Catalogue.guide.books, function(book){
				angular.forEach(book.chapters, function(chapter){
					angular.forEach(chapter.pages, function(page){
						page = Catalogue.pages[page.id];
						console.log(Catalogue.pages[page.id]);
					});
				});
			});


		}
	}
})

/************************************************************************
************************************************************************
DATA LOADING
************************************************************************
************************************************************************/


appCtrl.loadData = function($q, $http, $route, Catalogue) {
	var defer = $q.defer();

	$http.get('app/api/index.php', {params:{
		action:'getAll',
	}}).success(function(data){
		Catalogue.guides = data.guides;
		Catalogue.guide = Catalogue.guides[$route.current.params.guideIndex];
		if(angular.isDefined(data.pages)) {
			Catalogue.pages = data.pages;
		}
		Catalogue.walkData();
		Catalogue.updateImages();

		defer.resolve();
	})
	return defer.promise;
}

appCtrl.loadTemplates = function($q, $http, $route, Catalogue) {
	var chapter = $q.defer();
	$http.get('app/view/templates/editor/chapter-edit.html').success(function(data){
		Catalogue.templates['chapter'] = data;
		chapter.resolve(data);
	});

	var book = $q.defer();
	$http.get('app/view/templates/editor/book-edit.html').success(function(data){
		Catalogue.templates['book'] = data;
		chapter.resolve(data);
	});
	
	var page = $q.defer();
	$http.get('app/view/templates/editor/page-edit.html').success(function(data){
		Catalogue.templates['page'] = data;
		page.resolve(data);
	});	

	var guide = $q.defer();
	$http.get('app/view/templates/editor/guide-edit.html').success(function(data){
		Catalogue.templates['guide'] = data;
		page.resolve(data);
	});		
	var guideIndex = $q.defer();
	$http.get('app/view/templates/index/guide-index.html').success(function(data){
		Catalogue.templates['guideIndex'] = data;
		page.resolve(data);
	});		

	var flatIndex = $q.defer();
	$http.get('app/view/templates/index/flat-index.html').success(function(data){
		Catalogue.templates['flatIndex'] = data;
		page.resolve(data);
	});		

	return {
		none:'',
		page: page.promise,
		chapter: chapter.promise,
		book: book.promise,
		guide: guide.promise,
		guideIndex:guideIndex.promise,
		flatIndex:flatIndex.promise
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
		guide: [],
		edit:[],
		copy:[],
		templates:[],		
		pages:[],
		codeBrowser:[],
		structure: {
			guide: {
				title:"New Guide",
				type: "guide",
				id:{},
				books:[],
				images:[]
			},
			book: {
				title:"New Book",
				type:"book",
				images:[],
				chapters:[],
			},
			chapter: {
				title:"New Chapter",
				type:"chapter",
				images:[],
				pages:[],
			},
			page: {
				title:"New Page",
				type:"page",
				code:[],
				images:[],
				meta:[]
			}

		},			
		saveGuide: function(){
			this.guide.id = this.guide._id.$id;
			this.walkData();
			$http.get('app/api/index.php', {
				params:{
					collection:'guides',
					action:'saveGuide',
					json:angular.toJson(this.guide)
				}
			}).success(function(data){
				// console.log(data);
			});
		},
		newGuide: function(edit){
			var newGuide = $q.defer();
			$http.get('app/api/index.php', {
				params:{
					collection:'guides',
					action:'addGuide',
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
		copyItem: function(item){
			this.copy = item;
			$rootScope.$broadcast('itemCopied');
		},
		savePage: function() {
			if(this.edit.type ==  'page') {
				$http.get('app/api/index.php', {
					params:{
						collection:'content',
						action:'savePage',
						json:angular.toJson(this.edit)
					}
				}).success(function(data){
					// console.log(data)
				});
			}
		},
		walkData: function(){
			var ths = this;
			if(this.guide) {
			angular.forEach(ths.guide.books, function(book){
				angular.forEach(book.chapters, function(chapter){
					angular.forEach(chapter.pages, function(page, key, context){
						if(angular.isDefined(page.id)) {
							if (page.id = ths.pages[page.id].id) {
								context[key] = ths.pages[page.id];
							};
						}
					});
				});
			});
			}
		},
		//************************************************************************
		//IMAGES
		//************************************************************************
		imageBrowser:[],
		updateImages: function() {
			var images = this.imageBrowser;
			var ths = this;
			angular.forEach(this.guides, function(guide){
				ths.updateImage(guide);

				angular.forEach(guide.books, function(book){
					ths.updateImage(book);

					angular.forEach(book.chapters, function(chapter){
						ths.updateImage(chapter);

					});

				});
			});
			angular.forEach(this.pages, function(page){
				ths.updateImage(page);

			});

		},
		updateImage: function(data){
			var images = this.imageBrowser;

			if(angular.isDefined(data.images)) {
				angular.forEach(data.images, function(image){
					for(i=0;i<images.length;i++) {
						if(images[i].url == image.url){
							return false;
						};
					}
					images.push(image)

				})
			}

		},

	}
});


/************************************************************************
************************************************************************
THE CONTENT
************************************************************************
************************************************************************/
App.directive('contentContainer', function(Catalogue, $q, $http) {
	return {
		restrict:"A",
		scope:{},
		templateUrl:'app/view/templates/index/content-index.html',
		link: function(scope, element, attrs) {
			scope.catalogue = Catalogue;
		}
	}
});

/************************************************************************
************************************************************************
THE INDEX
************************************************************************
************************************************************************/
App.directive('sidebar', function($window){
	return {
		restrict:"C",
		link:function(scope, element, attrs){
			// var h = function(){
			// 	element.height($window.innerHeight - angular.element('.navbar').height() - 20);
			// }
			// h();
			// angular.element($window).bind('resize', function(){
			// 	h();
				
			// });
		}
	}
})
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
				$http.get('app/api/index.php', {
					params:{
						collection:'content',
						action:'addPage',
						json:angular.toJson(Catalogue.structure.page)
					}
				}).success(function(data){
					data.id = data._id.$id;
					data.type = 'page';
					Catalogue.pages[data.id] = data;
					scope.location.push(Catalogue.pages[data.id]);
					Catalogue.saveGuide();				
				});			
			}
			scope.copy = function() {
				Catalogue.copy = angular.copy(scope.target);
				console.log(Catalogue.copy)
			}
			

		}
	}
})
App.directive('indexSection', function(Catalogue){
	return {
		controller: function($scope){
			this.showChildren = false;
			this.showOptions = false;
			$scope.toggleChildren = function(){
				this.showChildren = true;
			}
		},	
		link: function(){

		}
	}
});
App.directive('indexChild', function(Catalogue){
	return {
		require:"^indexSection",
		link: function(scope, element, attrs, controller) {
			scope.showOptions = controller.showOptions;
		}
	}
})

App.directive('indexContainer', function($compile, Catalogue){
	return {
		restrict:"A",
		link:function(scope, element, attrs) {
			scope.catalogue = Catalogue;
			//RECOMPLE THE TEMPLATE ON NEW EDIT ITEM
			
			scope.$watch('catalogue.guide', function(){
				var type = scope.catalogue.guide.type;

				var templates = scope.catalogue.templates;
				element.html(templates[type+'Index']);

				$compile(element.contents())(scope);
				// scope.$apply();

			});

		}
	}
});



/************************************************************************
************************************************************************
EDITOR STUFF
************************************************************************
************************************************************************/
App.directive('clgEditor', function($templateCache, $compile, $routeParams, Catalogue) {
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
				// $scope.$apply();

			});

		}
	}
});

// App.directive('thingContainer', function(){
// 	return {
// 		restrict:"A",		
// 		link: function(scope, element, attrs){
// 			scope.$on('thingAdded', function(){
// 				scope.$apply();
// 			})
// 		}
// 	}
// })
App.directive('addThingTo', function(Catalogue){
	return {
		restrict:"A",
		scope: {
			addToWhere:'=',
			addWhat:'@'
		},
		
		link: function(scope, element, attrs){
			element.bind('click', function(){
				if(!angular.isDefined(scope.addToWhere[scope.addWhat])) {
					scope.addToWhere[scope.addWhat] = [];
				}
				console.log(scope.addToWhere)
				scope.addToWhere[scope.addWhat].push({text:''});
				scope.$emit('thingAdded');
				Catalogue.saveGuide();
			});
		}
	}
});
App.directive('removeThing', function(Catalogue){
	return {
		restrict:"A",
		scope: {
			removeFrom:'=',
			thingIndex:'='
		},
		link: function(scope, element, attrs){
			element.bind('click', function(){
				scope.removeFrom.splice(scope.thingIndex, 1);
				Catalogue.saveGuide();
				Catalogue.savePage();

			});
		}
	}
});

App.directive('codeAdder', function(Catalogue){
	return {
		restrict:"A",
		scope:{
		},
		// transclude:true,
		// template:'',
		link:function(scope, element, attrs) {
			scope.add = function() {
				Catalogue.edit.code.push(scope.newcode);
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
			scope.$on('contentPreview', function(){
								previewContent();

			})

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
		link: function(scope, element, attrs){
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
App.directive('clgItemBrowser', function($rootScope, $compile, $q, $http, Catalogue){
	return {
			restrict:"A",
			// templateUrl:"app/view/directives/code-browser.html",
			scope:{
				items:"=",
				target:"=",
				test:"@",
				clgItemBrowser:"@"
			},
			link:function(scope, element, attrs) {
				scope.sortableOptions = {
					start: function(e, ui) {
				    	// console.log(ui.item)

				    },
				    stop: function(e, ui) {
						// console.log()
						Catalogue.saveGuide();
						scope.$apply();
						$rootScope.$broadcast('contentPreview')

					},
					update: function(e, ui) {
					},
				}

				if(angular.isDefined(scope.target)) {
					scope.options="copy";
					if(!Catalogue.edit.images) {
						Catalogue.edit.images = [];
					}
				}

				
				scope.addItem = function(item){
					// if(item.type = "page") {
					// 	var item = {
					// 		id:item.id,
					// 		type:'page'
					// 	}
					// }
					scope.target.push(item)
					Catalogue.saveGuide();
					Catalogue.savePage();
				}

				if(Catalogue.templates[attrs.clgItemBrowser]) {
					element.html(Catalogue.templates[attrs.clgItemBrowser]);
					$compile(element.contents())(scope);
				} else {
					// var template = $q.defer();
					$http.get('app/view/templates/directives/clgItemBrowser/'+attrs.clgItemBrowser+'.html').success(function(data){
						element.html(data);
						$compile(element.contents())(scope);
						Catalogue.templates[attrs.clgItemBrowser] = data;

					});	
				}


					
			}
		}
})
App.directive('imageBrowser', function($compile, Catalogue){
	return {
		restrict:"A",
		scope:{
			imageBrowser:"="
		},
		link:function(scope, element, attrs) {
			if(!angular.isDefined(scope.imageBrowser)) {
				scope.imageBrowser = [];
			}
			if(scope.imageBrowser.length > 0) {

			}
			element.html('<div class="imageContainer"><div class="imagePreview" ng-repeat="image in imageBrowser"><img src="{{image.url}}"></div></div>');
			$compile(element.contents())(scope);
			scope.$apply();

			scope.$on('fileUploaded', function() {
				Catalogue.updateImage(Catalogue.edit)
				console.log('file uploaded')
				scope.$apply();
			})
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

						// console.log(Catalogue);

						if(!Catalogue.edit.images) {
							Catalogue.edit.images = [];
						}
						Catalogue.edit.images.push(data);
						Catalogue.updateImage(Catalogue.edit)
						scope.$apply();
						Catalogue.savePage();
						Catalogue.saveGuide();
						$rootScope.$broadcast('fileUploaded');
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
		templateUrl:'app/view/templates/directives/globalNav/globalNav.html',
		link: function(scope) {
			scope.catalogue = Catalogue;
		}
	}
})











