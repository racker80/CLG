
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
	.state('guides.index', {
		url:':type/:index/',
		templateUrl:"app/view/guides.detail.html",
		controller: function($scope, $state, $stateParams, DataService, PrepData) {
			console.log('running guides.index state controller:')
			
			DataService.guide = DataService.guides[$stateParams.index]
			
			$scope.guide = DataService.guide;

			console.log(DataService.guide)

			PrepData.bindPages(DataService.guide);

		}
	})
	.state('guides.index.edit', {
		url:'*editId',
		// templateProvider: function ($stateParams, $state, $http, DataService) {				
		// 	var type = DataService.edit.type;
		// 	// var type="chapter";
		// 	if(!type) {
		// 		type = "chapter"
		// 	}
		// 	return $http.get('app/view/templates/editor/'+type+'-edit.html')
		// 	.then(function(data){
		// 		// console.log(data)
		// 		// DataService.templates[$stateParams.type] = data.data;
		// 		return data.data;
		// 	});
		// },
		templateUrl:"app/view/guides.detail.edit.html",
		controller: function($scope, $state, $stateParams, DataService, PrepData) {
			console.log('running guides.index.edit controller:')
			//Set the current guide

			PrepData.indexLocationState();


			//SET EDIT ON THE SCOPE
			$scope.edit = DataService.edit;

		}
	})

	.state('guides.content', {
		url:'content',
		templateUrl:"app/view/guides.detail.html",
		controller: function($scope, $state, $stateParams, DataService) {
			DataService.guide = {
				children:DataService.pages,
			};
			console.log(DataService)
			$scope.guide = DataService.guide;
		}
	})
};
var App = angular.module('App', ['ui.bootstrap', 'ui.sortable', 'ui.state', 'ngResource', 'ngSanitize', 'imageupload']).config(appConfig);

App.factory('PrepData', function(DataService, $stateParams){

	return {
		currentLocation: function() {
			//get the location from stateparams
			var location = $stateParams.editId.split('/');
			//prep it
			location.splice(-1, 1)[0]
			return location;
		},
		indexLocationState: function() {
			console.log('PREPDATA PrepData.indexLocationState')

			//set the base item to edit
			var item = DataService.guide;

			//get the location from stateparams
			var location = this.currentLocation();

			console.log('setting minimized state for index')
			if(location.length > 0) {
				var i = 0;
				_.each(location, function(value, key, list){
					item = item.children[value]
					item.$minimized = false;
					// console.log(item)

					if(i === list.length-1) {
						// item.children[value].$active = true;
					}
					i++;
				});
			} else {
				item = DataService.guide;
			}
			//drop the proper thing in the editor
			DataService.edit = item;

			console.log('setting the edit object')
			console.log(DataService.edit)

			return true;
		},
		pageIds: function() {
			var idList = [];
			_.each(DataService.pages, function(value, key, list) {
				idList.push(value.id);
			})
			return idList;

		},
		bindPages: function(parent) {
			console.log('PREPDATA: Binding Pages')
			var ths = DataService;

			if(!angular.isDefined(parent.children)) {
				return false;
			}
			
			var idList = this.pageIds();

			angular.forEach(parent.children, function(child, key, context) {
				if(child.type==='page') {
					
					var pageKey = idList.indexOf(child.id)
					var page = ths.pages[pageKey];

					//if it's a page, set it.
					if(angular.isDefined(child.id) && angular.isDefined(page)) {
						// console.log('setting page')
						context[key] = page;
					}
					//if it doesn't exist, remove it.
					if(!angular.isDefined(page)){
						// console.log('splicing page')
						context.splice(key, 1);
					}											

				}

				//if it has children, recurse it.
				if(angular.isDefined(child.children)) {
					// console.log('this has children...')
					ths.walker(child)
				}

				return true;
			});
		}
	}
})



var stateCtrl = App.controller('StateCtrl', function($scope, $state, guides, pages, templates, DataService){
			console.log('running guides root controller:')

			DataService.guides = guides;
			DataService.pages = pages;
			DataService.templates = templates;
			
			//is everything where it should be?
			console.log(DataService.guides)			
			console.log(DataService.pages)			
			console.log(DataService.templates)			

});
stateCtrl.loadGuides = function($q, $http) {

	return $http.get('app/api/index.php?action=getAll')
	.then(function(data){
		return data.data.guides;
	})
}
stateCtrl.loadPages = function($q, $http) {

	return $http.get('app/api/index.php?action=getAll')
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

/************************************************************************
************************************************************************
THE CATALOGUE
************************************************************************
************************************************************************/
App.service('DataService', function($rootScope, $http, $route, $routeParams, $location, $q){

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
				childtype:"book",
				id:{},
				children:[],
				images:[]
			},
			book: {
				title:"New Book",
				type:"book",
				childtype:"chapter",
				images:[],
				children:[],
			},
			chapter: {
				title:"New Chapter",
				type:"chapter",
				childtype:"page",
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
			var copy = angular.copy(item);
			this.clipboard = copy;
			$rootScope.$broadcast('itemCopied');
			console.log('item copied: '+item);
		};

		//PASTE SOMETHING SOMEWHERE
		this.paste = function(location) {
			location.push(this.clipboard);
			//link pages
			this.saveGuide();
			console.log('pasted item: ');

		}
		//SAVE THE GUIDE
		this.saveGuide = function(){
			if(this.edit.type === "page") {
				this.savePage();
				console.log('saving page')

			}
			if(this.guide) {
				var ths = this;
				this.walkData();
				$rootScope.$broadcast('somethingChanged');
				var defer = $q.defer();
				$http.post('app/api/post.php', {
						collection:'guides',
						action:'saveGuide',
						json:this.guide
				}).success(function(data){
					console.log('saved '+data.title);
					console.log(data)
					defer.resolve(data);
				});
				return defer.promise;
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
				var defer = $q.defer();
				$http.post('app/api/post.php', {
						collection:'content',
						action:'savePage',
						json:page
				}).success(function(data){
					defer.resolve(data.title);
				});
				return 'saved page: '+defer.promise;
			}
		};
		this.setPage = function(page) {

		}
		this.walker = function(parent) {
			var ths = this;
			if(!angular.isDefined(parent.children)) {
				return false;
			}
			
			var idList = [];

			_.each(ths.pages, function(value, key, list) {
				idList.push(value.id);
			})

			angular.forEach(parent.children, function(child, key, context) {
				if(child.type==='page') {
					
					var pageKey = idList.indexOf(child.id)
					var page = ths.pages[pageKey];

					//if it's a page, set it.
					if(angular.isDefined(child.id) && angular.isDefined(page)) {
						// console.log('setting page')
						context[key] = page;
					}
					//if it doesn't exist, remove it.
					if(!angular.isDefined(page)){
						// console.log('splicing page')
						context.splice(key, 1);
					}											

				}



				//if it has children, recurse it.
				if(angular.isDefined(child.children)) {
					// console.log('this has children...')
					ths.walker(child)
				}

			});

			return true;

		}

		//WALK THE DATA!  BIND THE DATA!
		this.walkData = function(){
			var ths = this;

			if(this.guide) {
				//does it have children
				//if so what type are they?
				//pass the children back to the walker

				console.log('starting walker...')
				return ths.walker(this.guide);
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







var appCtrl = App.controller('AppCtrl', function($scope, $q, DataService, $route, $routeParams){
	$scope.catalogue = DataService;
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
App.directive('sortableOptions', function(DataService){
	return {
		link:function(scope) {
			scope.sortableOptions = {
				start: function(e, ui) {
			    	// console.log(ui.item)

				},
				stop: function(e, ui) {
					// console.log()
			    	DataService.saveGuide();

				},
			    update: function(e, ui) {
			    },
			    
			};
		}
	}
})









/************************************************************************
************************************************************************
THE INDEX
************************************************************************
************************************************************************/



/************************************************************************
************************************************************************
EDITOR STUFF
************************************************************************
************************************************************************/
App.directive('clgEditor', function($compile, $stateParams, $http, DataService) {
	return {
		scope: {},
		// templateUrl:'app/view/templates/editor/chapter-edit.html',
		controller: function($scope, $element, $attrs, $state, $stateParams, DataService) {
			$scope.edit = DataService.edit;
			
			this.templateCompiler = function() {
				var type = $scope.edit.type;
				var templates = DataService.templates;
				console.log('compiling template...')
				$http.get('app/view/templates/editor/'+type+'-edit.html').success(function(data){
						DataService.templates[type] = data;
						$element.html(data);
						$compile($element.contents())($scope);
					});

				
			}
			//RECOMPLE THE TEMPLATE ON NEW EDIT ITEM
			this.templateCompiler();
		},
		link: function(scope, element, attrs, controller) {

			// scope.$on('editItem', function(){

			// 	controller.templateCompiler();

			// });

		}
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

App.directive('codeAdder', function(DataService){
	return {
		restrict:"A",
		scope:{
		},
		// transclude:true,
		// template:'',
		link:function(scope, element, attrs) {
			scope.add = function() {
				DataService.edit.code.push(scope.newcode);
				DataService.saveGuide();
				DataService.savePage();
			}

		}
	}
})

App.directive('contentPreview', function(DataService){
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
				angular.forEach(DataService.edit.code, function(value, key) {
					scope.content = scope.content.replace('[code '+key+']', '<pre>'+value+'</pre>');
				});
                //REPLACE THE IMAGES
                angular.forEach(DataService.edit.images, function(value, key) {
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
App.directive('clgItemBrowser', function($rootScope, $compile, $q, $http, DataService){
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
				scope.catalogue = DataService;
				scope.sortableOptions = {
					start: function(e, ui) {
				    	// console.log(ui.item)

				    },
				    stop: function(e, ui) {
						// console.log()
						DataService.saveGuide();
						scope.$apply();
						$rootScope.$broadcast('contentPreview')

					},
					update: function(e, ui) {
					},
				}

				if(angular.isDefined(scope.target)) {
					scope.options="copy";
					if(!DataService.edit.images) {
						DataService.edit.images = [];
					}
				}

				scope.addItem = function(item){
					scope.target.push(item)
					DataService.saveGuide();
					DataService.savePage();
				}

				if(DataService.templates[attrs.clgItemBrowser]) {
					element.html(DataService.templates[attrs.clgItemBrowser]);
					$compile(element.contents())(scope);
				} else {
					// var template = $q.defer();
					$http.get('app/view/templates/directives/clgItemBrowser/'+attrs.clgItemBrowser+'.html').success(function(data){
						element.html(data);
						$compile(element.contents())(scope);
						DataService.templates[attrs.clgItemBrowser] = data;

					});	
				}


					
			}
		}
})
App.directive('imageBrowser', function($compile, DataService){
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
				DataService.updateImage(DataService.edit)
				console.log('file uploaded')
				scope.$apply();
			})
		}
	}
})
App.directive('clgUploadContainer', function($rootScope, $http, DataService){
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

						// console.log(DataService);

						if(!DataService.edit.images) {
							DataService.edit.images = [];
						}
						DataService.edit.images.push(data);
						DataService.updateImage(DataService.edit)
						scope.$apply();
						DataService.savePage();
						DataService.saveGuide();
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
App.directive('globalNav', function(DataService){
	return {
		restrict:"AE",
		scope: {},
		templateUrl:'app/view/templates/directives/globalNav/globalNav.html',
		link: function(scope) {
			scope.catalogue = DataService;
		}
	}
})











