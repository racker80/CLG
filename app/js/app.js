
// angular.module('phonecat', ['phonecatServices']).
//   config(['$routeProvider', function($routeProvider) {
//   $routeProvider.
//       when('/guides', {templateUrl: 'app/partials/guides-list.php',   controller: PhoneListCtrl}).
//       when('/guides/:slug', {templateUrl: 'app/partials/guides-detail.php',   controller: PhoneDetailCtrl}).

//       when('/phones', {templateUrl: 'app/partials/phone-list.html',   controller: PhoneListCtrl}).
//       when('/phones/:phoneId', {templateUrl: 'app/partials/phone-detail.html', controller: PhoneDetailCtrl}).
//       otherwise({redirectTo: '/phones'});
// }]);


var appConfig = function($routeProvider, $stateProvider, $urlRouterProvider) {
	// $routeProvider
	// .when('/', {
	// 	controller: 'AppCtrl',
	// 	templateUrl: 'app/view/index.php',
	// 	resolve: {
	// 		guides: appCtrl.loadData,
	// 		templates: appCtrl.loadTemplates
	// 	}
	// })
	// .when('/guide/:guideIndex', {
	// 	controller: 'AppCtrl',
	// 	templateUrl: 'app/view/guide.php',
	// 	resolve: {
	// 		guides: appCtrl.loadData,
	// 		templates: appCtrl.loadTemplates
	// 	}
	// })
	// .when('/guide/:guideIndex/:bookIndex', {
	// 	controller: 'AppCtrl',
	// 	templateUrl: 'app/view/guide.php',
	// 	resolve: {
	// 		guides: appCtrl.loadData,
	// 		templates: appCtrl.loadTemplates,
	// 	}
	// })
	// .when('/guide/:guideIndex/:bookIndex/:chapterIndex', {
	// 	controller: 'AppCtrl',
	// 	templateUrl: 'app/view/guide.php',
	// 	resolve: {
	// 		guides: appCtrl.loadData,
	// 		templates: appCtrl.loadTemplates
	// 	}
	// })
	// .when('/guide/:guideIndex/:bookIndex/:chapterIndex/:pageIndex', {
	// 	controller: 'AppCtrl',
	// 	templateUrl: 'app/view/guide.php',
	// 	resolve: {
	// 		guides: appCtrl.loadData,
	// 		templates: appCtrl.loadTemplates
	// 	}
	// })	
	// .when('/content', {
	// 	controller: 'AppCtrl',
	// 	templateUrl: 'app/view/content.php',
	// 	resolve: {
	// 		guides: appCtrl.loadData,
	// 		templates: appCtrl.loadTemplates
	// 	}
	// })
	// .when('/content/:contentId', {
	// 	controller: 'AppCtrl',
	// 	templateUrl: 'app/view/content.php',
	// 	resolve: {
	// 		guides: appCtrl.loadData,
	// 		templates: appCtrl.loadTemplates
	// 	}
	// })	
	// .when('/reset', {
	// 	resolve: {
	// 		reset: function($http){
	// 			$http.get('data.php');
	// 			return true;
	// 		},
	// 	}
	// })

	$stateProvider.state('guides', {
		templateUrl: 'app/view/guides.html',
		url:'/',
		abstract:true,
		resolve: {
			guides:stateCtrl.loadGuides,
			pages:stateCtrl.loadPages,
			templates:stateCtrl.loadTemplates,
		},
		controller:'StateCtrl',
	})
	.state('guides.list', {
		url:'',
		templateUrl:"app/view/guides.list.html",
		controller: function($scope, $state, DataService) {
			$scope.guides = DataService.guides;
		}
	})
	.state('guides.detail', {
		url:'guide/:index',
		templateUrl:"app/view/guides.detail.html",
		controller: function($scope, $state, $stateParams, DataService) {
			DataService.guide = DataService.guides[$stateParams.index]
			$scope.guide = DataService.guide;
		}
	})
	.state('guides.detail.edit', {
		url:'/edit/:type/*editId',
		// templateUrl:"app/view/guides.detail.edit.html",
		templateProvider: function ($timeout, $stateParams, $http, DataService) {
			
			return $http.get('app/view/templates/editor/'+$stateParams.type+'-edit.html')
			.then(function(data){
				// console.log(data)
				return data.data;
			});
		},
		controller: function($scope, $state, $stateParams, DataService) {
			var location = $stateParams.editId.split('/');
			location.splice(-1, 1)[0]
			console.log(location)
			var item = DataService.guide;
			_.each(location, function(value, key, list){
				item = item.children[value]

			});
			DataService.edit = item;
			$scope.edit = DataService.edit;
			$scope.catalogue = DataService;
		}
	})

};
var App = angular.module('App', ['ui.bootstrap', 'ui.sortable', 'ui.state', 'ngResource', 'ngSanitize', 'imageupload']).config(appConfig);



var stateCtrl = App.controller('StateCtrl', function($scope, $state, guides, pages, templates, DataService){
			DataService.guides = guides;
			DataService.pages = pages;
			DataService.templates = templates;

});
stateCtrl.loadGuides = function($q, $http) {

	return $http.get('/db.json')
	.then(function(data){
		return data.data.guides;
	})
}
stateCtrl.loadPages = function($q, $http) {

	return $http.get('/db.json')
	.then(function(data){
		return data.data.pages;
	})
}
stateCtrl.loadTemplates = function($q, $http, DataService) {
	var chapter = $q.defer();
	$http.get('app/view/templates/editor/chapter-edit.html').success(function(data){
		DataService.templates['chapter'] = data;
		chapter.resolve(data);
	});

	var book = $q.defer();
	$http.get('app/view/templates/editor/book-edit.html').success(function(data){
		DataService.templates['book'] = data;
		chapter.resolve(data);
	});
	
	var page = $q.defer();
	$http.get('app/view/templates/editor/page-edit.html').success(function(data){
		DataService.templates['page'] = data;
		page.resolve(data);
	});	

	var guide = $q.defer();
	$http.get('app/view/templates/editor/guide-edit.html').success(function(data){
		DataService.templates['guide'] = data;
		page.resolve(data);
	});		
	var guideIndex = $q.defer();
	$http.get('app/view/templates/index/guide-index.html').success(function(data){
		DataService.templates['guideIndex'] = data;
		page.resolve(data);
	});		

	var flatIndex = $q.defer();
	$http.get('app/view/templates/index/flat-index.html').success(function(data){
		DataService.templates['flatIndex'] = data;
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

App.service('DataService', function($http){
	this.guides = {};
	this.pages = {};
	this.templates = {};
	this.edit = {};


	//SAVE THE GUIDE
	this.saveGuide = function(){
		if(this.guide) {
			var ths = this;
			// this.walkData();
			$http.post('app/api/post.php', {
				collection:'guides',
				action:'saveGuide',
				json:this.guide
			}).success(function(data){
				console.log('saved '+ths.guide.title);
			});

		}

	};
})








var appCtrl = App.controller('AppCtrl', function($scope, $q, walkData, Catalogue, $route, $routeParams){
	$scope.catalogue = Catalogue;
	$scope.routeParams = $routeParams;

	// console.log($scope)

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

	$scope.$watch($scope.routeParams, function(){
		var route = $scope.routeParams;
		if(route.pageIndex) {
			$scope.catalogue.edit = $scope.catalogue.guide.children[route.bookIndex].children[route.chapterIndex].children[route.pageIndex];
			$scope.$broadcast('editItem');
			console.log('page')
			return;
		}
		if(route.chapterIndex) {
			$scope.catalogue.edit = $scope.catalogue.guide.children[route.bookIndex].children[route.chapterIndex];
			$scope.$broadcast('editItem');
			console.log('chapeter')
			return;
		}
		if(route.bookIndex) {
			$scope.catalogue.edit = $scope.catalogue.guide.children[route.bookIndex];
			$scope.$broadcast('editItem');
			// console.log('book')
			return;
		}
		if(route.guideIndex) {

			$scope.catalogue.guide = $scope.catalogue.guides[route.guideIndex];
			$scope.catalogue.edit = $scope.catalogue.guides[route.guideIndex];

			$scope.$broadcast('editItem');
			console.log('guide')
			return;
		}
		if(route.contentId) {
			console.log(route)
			$scope.catalogue.edit = $scope.catalogue.pages[route.contentId];
			$scope.$broadcast('editItem');
			console.log('content')
			return;
		}		
	}) 

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
appCtrl.edit = function($q, $http, $route, Catalogue) {
	return true;
}

appCtrl.loadData = function($q, $http, $route, Catalogue) {
	var defer = $q.defer();

	if(Catalogue.guides.length > 0) {
		return true;
	}
	// $http.get('app/api/index.php', {params:{
	// 	action:'getAll',
	// }})
	$http.get('/db.json')
	.success(function(data){
		if(angular.isDefined(data.guides)) {
		Catalogue.guides = data.guides;
		Catalogue.guide = Catalogue.guides[$route.current.params.guideIndex];
		}
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
	if(Catalogue.templates.length > 0) {
		return true;
	}

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
App.service('Catalogue', function($rootScope, $http, $route, $routeParams, $location, $q){

		this.guides = [];
		this.guide = [];
		this.edit =[];
		this.clipboard =[];
		this.templates =[];
		this.pages =[];
		this.codeBrowser = [];
		this.imageBrowser = [];		
		this.structure = {
			guide: {
				title:"New Guide",
				type: "guide",
				id:{},
				children:[],
				images:[]
			},
			book: {
				title:"New Book",
				type:"book",
				images:[],
				children:[],
			},
			chapter: {
				title:"New Chapter",
				type:"chapter",
				images:[],
				children:[],
			},
			page: {
				title:"New Page",
				type:"page",
				code:[],
				images:[],
				meta:[],
			}

		};

		//ADD A NEW THING SOMEWHERE
		this.addNew = function(location, type) {
			var ths = this;
			//Create the location
			if(!angular.isDefined(location)) {
					console.log('location doesnt exist, creating blank array');
					location=[];
				}

			//Create a new thing
			if(!angular.isDefined(type)) {
				console.log('No type is defined, creating empty object');
				type = {};
				location.push(type);
				this.saveGuide();
				return;
			}
			//Create a new page
			if(type == 'page') {
				this.newPage(location);
				return;	
			}

			//else do this
			location.push(angular.copy(ths.structure[type]));
			ths.saveGuide();
			console.log('added new item');
			console.log(ths.guide.children)

		}
		//ADD AN EXISTING ITEM
		this.addExisting = function(location, item) {
			if(!angular.isDefined(location)) {
				location = [];
			}
			location.push(item);			
			this.saveGuide();
			console.log('added existing item');
		}
		//REMOVE A THING FROM A PLACE
		this.removeItem = function(location, key) {
			location.splice(key, 1);
			this.saveGuide();
			console.log('removed item: '+key);
		}
		//COPY SOMETHING TO THE CLIPBOARD
		this.copy = function(item){
			this.clipboard = item;
			$rootScope.$broadcast('itemCopied');
			console.log('item copied: '+item);
		};

		//PASTE SOMETHING SOMEWHERE
		this.paste = function(location) {
			location.push(this.clipboard);
			this.saveGuide();
			console.log('pasted item: ');

		}
		//SAVE THE GUIDE
		this.saveGuide = function(){
			if(this.guide) {
				var ths = this;
				this.walkData();
				$http.post('app/api/post.php', {
						collection:'guides',
						action:'saveGuide',
						json:this.guide
				}).success(function(data){
					console.log('saved '+ths.guide.title);
				});

			}

		};
		//ADD A NEW GUIDE
		this.newGuide = function(edit){
			var ths = this;
			var newGuide = $q.defer();
			$http.post('app/api/post.php', {
					collection:'guides',
					action:'addGuide',
					json:this.structure.guide					
			}).success(function(data){
				console.log(data)
				ths.guides.push(data)
				newGuide.resolve(data);
			});
			
			if(edit == false) {
				return
			}

			var index = this.guides.length-1;
			$location.path('/'+index);

		};
		//DELETE THAT NAUGHTY GUIDE
		this.deleteGuide = function(guideIndex){
			var ths = this;
			$http.post('app/api/post.php', {
				collection:'guides',
				action:'deleteGuide',
				json:ths.guides[guideIndex],
			}).success(function(data){
				ths.guides.splice(guideIndex, 1);
				ths.saveGuide();				
				console.log('forever deleted that guide')
			});	
		};

		//CREATE A NEW PAGE - with optional structure!
		this.newPage = function(location, page) {
			var ths = this;
			if(!page) {
				page = ths.structure.page;
			}
			$http.post('app/api/post.php', {
						collection:'content',
						action:'addPage',
						json:page,
				}).success(function(data){
					ths.pages[data.id] = data;
					if(location) {
						location.push(ths.pages[data.id]);
					}
					ths.saveGuide();
					console.log('created page: '+data.title);			
				});
		}
		//GET RID OF THAT PAGE!
		this.deletePage = function(page) {
			var ths = this;
			$http.post('app/api/post.php', {
				collection:'content',
				action:'deletePage',
				json:page,
			}).success(function(data){
				delete ths.pages[page.id];
				ths.saveGuide();	
				console.log('Seriously, really deleted page for good');
			
			});	
		}
		//SAVE THE PAGE!
		this.savePage = function(page) {
			if(!page) {
				page = this.edit;
			}
			if(this.edit.type ==  'page') {
				$http.post('app/api/post.php', {
						collection:'content',
						action:'savePage',
						json:page
				}).success(function(data){
					console.log('saved page: '+data.title)
				});
			}
		};
		this.setPage = function(page) {

		}
		this.walker = function(parent) {
			var ths = this;
			if(!angular.isDefined(parent.children)) {
				return false;
			}
			angular.forEach(parent.children, function(child, key, context) {

				//if it's a page, set it.
				if(angular.isDefined(child.id) && angular.isDefined(ths.pages[child.id])) {
					console.log('setting page')
					context[key] = ths.pages[child.id];
				}
				//if it doesn't exist, remove it.
				if(child.type==="page" && !angular.isDefined(ths.pages[child.id])){
					console.log('splicing page')
					context.splice(key, 1);
				}

				//if it has children, recurse it.
				if(angular.isDefined(child.children)) {
					console.log('this has children...')
					ths.walker(child)
				}

			});
		}

		//WALK THE DATA!  BIND THE DATA!
		this.walkData = function(){
			var ths = this;
			// if(this.guide) {
			// angular.forEach(ths.guide.books, function(book){				
			// 	angular.forEach(book.chapters, function(chapter){
			// 		angular.forEach(chapter.pages, function(page, key, context){
			// 			if(angular.isDefined(page.id) && angular.isDefined(ths.pages[page.id])) {
			// 				context[key] = ths.pages[page.id];
			// 			} else {
			// 				context.splice(key, 1);
			// 			}
			// 		});
			// 	});
			// });
			// }

			if(this.guide) {
				//does it have children
				//if so what type are they?
				//pass the children back to the walker

				console.log('starting walker...')
				ths.walker(this.guide);
			}
		};
		//************************************************************************
		//IMAGES
		//************************************************************************
		this.updateImages = function() {
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

		};
		this.updateImage = function(data){
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

		};


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
		conroller:"AppCtrl",
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
		templateUrl:'app/view/templates/editor/chapter-edit.html',
		controller: function($scope, $element, $attrs, $state, $stateParams, DataService) {
			$scope.catalogue = [];
			$scope.catalogue = DataService;
			console.log(DataService)
			console.log($scope.catalogue)
			// var type = DataService.edit.type;

			// var templates = $scope.catalogue.templates;
			// $element.html(templates[type]);

			// $compile($element.contents())($scope);
				// $scope.$apply();
		}

		// controller: function($scope, $element, $attrs, $http) {
		// 	$scope.catalogue = Catalogue;
		// 	$scope.routeParams = $routeParams;


		// },
		// link: function($scope, $element, $attrs, controller) {
			
		// 	//RECOMPLE THE TEMPLATE ON NEW EDIT ITEM
			
		// 	$scope.$on('editItem', function(){

		// 		var type = $scope.catalogue.edit.type;

		// 		var templates = $scope.catalogue.templates;
		// 		$element.html(templates[type]);

		// 		$compile($element.contents())($scope);
		// 		// $scope.$apply();

		// 	});

		// }
	}
});
App.directive('editorSidebar', function(){
	return {
		restrict:"AE",
		require:'^clgEditor',
		scope: {
			items:'=',
			type:'@',
			urlBase:'@'

		},
		templateUrl:'app/view/templates/directives/clgItemBrowser/page-browser.html',
		link: function(){

		}
	}
})
App.directive('contentBrowser', function(){
	return {
		controller:'actionsCtrl',
		restrict:"AE",
		scope: {
			items:"=",
			sortable:"=",
			local:"=",
			urlBase:"@",
			type:"@",

		},
		templateUrl:'app/view/templates/directives/contentBrowser/content-browser.html',
		link:function(scope, element, attrs) {
			if(angular.isDefined(scope.local)) {
				scope.copy = 'true';
			}
			// console.log(scope)
		}
	}
})

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
				scope.catalogue = Catalogue;
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











