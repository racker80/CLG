
App.factory('GuideModel', function($resource, $http, $rootScope, $routeParams) {
	return {
		getGuides: function() {

			return $http.get('/app/api');
			
		},

		getGuide: function(slug) {

			return $http.get('/app/api', {params:{slug:slug}});

		},

		addGuide: function(data) {

			return $http.get('/app/api/add-guide.php', {params:data});

		},

		deleteGuide: function(data) {

			return $http.get('/app/api/delete-guide.php', {params:{id:data}});
			

		},
		saveGuide: function(data) {
			if(!data.id) {
				data.id = data._id.$id;
			}

			return $http.get('/app/api/save-guide.php', {
				params:{
					json:angular.toJson(data)
				}
			});
		},
		addBook: function(item) {
			if(!$rootScope.guide.books) {
				$rootScope.guide.books = [];
			}
			$rootScope.guide.books.push(item);
		},
		deleteBook: function(index) {
			$rootScope.guide.books.splice(index, 1);
		},
		addChapter: function(item) {
			if(!$rootScope.guide.books[$routeParams.bookSlug].chapters) {
				$rootScope.guide.books[$routeParams.bookSlug].chapters = [];
			}

			$rootScope.guide.books[$routeParams.bookSlug].chapters.push(item);
		},
		deleteChapter: function(index) {
			$rootScope.guide.books[$routeParams.bookSlug].chapters.splice(index, 1);
		},
		addPageRef: function(item) {
			if(!$rootScope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages) {
				$rootScope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages = [];
			}
			$rootScope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages.push(item);			

		},
		deletePageRef: function(index) {
			$rootScope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages.splice(index, 1);	

		},		
	}
});







App.factory('PageModel', function($resource, $http) {
	return {
		getPage: function(data) {
			return $http.get('/app/api/get-page.php', {params:data});
		},

		createNewPage: function(data) {
			return $http.get('/app/api/add-page.php', {params:data});
		},

		deletePage: function(data) {
			return $http.get('/app/api/delete-page.php', {params:data});
		},
		getContent: function() {
			return $http.get('/app/api/get-content.php');
		},
		savePage: function(data) {
			if(!data.id) {
				data.id = data._id.$id;
			}
			return $http.get('/app/api/save-page.php', {
				params:{
					json:angular.toJson(data)
				}
			});

		}

	}



});








App.factory('UtilFactory', function($resource, $http, $rootScope, $routeParams, $dialog, PageModel, GuideModel) {

	return {
		makeMarkdown: function(text) {
			var converter = new Showdown.converter();
			if(text) {
				return converter.makeHtml(text);
			}
            
		},
		getPageFromId: function(id, collection) {
			var ref = {
                ref:collection,
                id: id
              }             
              return PageModel.getPage(ref);
		},
		currentPlace: function() {
			return $rootScope.guide.books[$routeParams.bookSlug];
		},

		addBookDialog: function() {
						// Inlined template for demo
						var t = '<div class="modal-header">'+
						'<h3>Add a book</h3>'+
						'</div>'+
						'<div class="modal-body">'+
						'<form><input class="input" ng-model="form.title" />'+
						'</div>'+
						'<div class="modal-footer">'+
						'<button ng-click="addBook(title)" class="btn btn-primary" >Add</button> <button ng-click="close(title)" class="btn btn-primary" >Close</button>'+
						'</form></div>';

						// the dialog is injected in the specified controller
					    function TestDialogController($scope, dialog){
					    	$scope.addBook = function(){
					    		GuideModel.addBook($scope.form);
					    		GuideModel.saveGuide($rootScope.guide);
					    	};
					    }

						var opts = {
							backdrop: true,
							keyboard: true,
							backdropClick: true,
						    template:  t, // OR: templateUrl: 'path/to/view.html',
						    controller: TestDialogController
						};

						var d = $dialog.dialog(opts);
						d.open().then(function(result){
							if(result)
							{
								alert('dialog closed with result: ' + result);
							}
						});



		},

		addChapterDialog: function(bookIndex) {
						// Inlined template for demo
						var t = '<div class="modal-header">'+
						'<h3>Add a Chapter</h3>'+
						'</div>'+
						'<div class="modal-body">'+
						'<form><input class="input" ng-model="form.title" />'+
						'</div>'+
						'<div class="modal-footer">'+
						'<button ng-click="addItem()" class="btn btn-primary" >Add</button> <button ng-click="close(title)" class="btn btn-primary" >Close</button>'+
						'</form></div>';

						$routeParams.bookSlug = bookIndex;

						// the dialog is injected in the specified controller
					    function TestDialogController($scope, dialog){
					    	$scope.addItem = function(){
					    		GuideModel.addChapter($scope.form);
					    		GuideModel.saveGuide($rootScope.guide);
					    	};
					    }

						var opts = {
							backdrop: true,
							keyboard: true,
							backdropClick: true,
						    template:  t, // OR: templateUrl: 'path/to/view.html',
						    controller: TestDialogController
						};

						var d = $dialog.dialog(opts);
						d.open().then(function(result){
							if(result)
							{
								alert('dialog closed with result: ' + result);
							}
						});



		}



	}
	
	

});

App.factory('sharedServices', function($rootScope, $routeParams) {
	var sharedServices = {};
	sharedServices.copiedItem = {};
	sharedServices.copyChapter = function(item) {
		this.copiedItem = item;
		$rootScope.$broadcast('copiedChapter');
	}
	sharedServices.copyBook = function(item) {
		this.copiedItem = item;
		$rootScope.$broadcast('copiedBook');
	}
	sharedServices.broadcastItem = function() {
		$rootScope.$broadcast('copiedChapter');
	}
	sharedServices.getBooks = function() {
		return $rootScope.guide.books;
	}
	sharedServices.addBook = function(item) {
		if(!$rootScope.guide.books) {
			$rootScope.guide.books = [];
		}
		$rootScope.guide.books.push(item);
	}

	sharedServices.guide = {};
	sharedServices.currentGuide = function(item) {
		this.guide = item;
		$rootScope.$broadcast('guideReady');
	}

	return sharedServices;
});



// App.factory('BookModel', function($resource, $http) {

// 	return {

// 		// addBook: function(data) {
// 		// 	return $http.get('/app/api/add-book.php', {params:data});
// 		// },

// 		// deleteBook: function(data) {
// 		// 	return $http.get('/app/api/delete-book.php', {params:data});

// 		// }


// 	}

	

// });



// App.factory('ChapterModel', function($resource, $http) {

// 	return {
// 		// addChapter: function(data) {
// 		// 	return $http.get('/app/api/add-chapter.php', {params:data});

// 		// },

// 		// deleteChapter: function(data) {
// 		// 	return $http.get('/app/api/delete-chapter.php', {params:data});

// 		// },
// 		// addPageRef: function(data) {
// 		// 	return $http.get('/app/api/add-chapter-pageref.php', {params:data});
// 		// },
// 		// deletePageRef: function(data) {
// 		// 	return $http.get('/app/api/delete-chapter-pageref.php', {params:data});
// 		// }

// 	}



// });




// App.service('GuideModel', function($resource, $http) {

// 	this.getGuides = function() {
	
// 		return $resource('/app/api', {}, {
// 			query: {
// 				method:'GET',
// 				isArray:true
// 			}
// 		}).query();

	
// 	}

// 	this.getGuide = function(slug) {
	
// 		return $resource('/app/api', {}, {
// 			query: {
// 				method:'GET',
// 				params:{slug:slug},
// 				isArray:false
// 			}
// 		});

// 		// $http.get('/app/api', {
// 		// 	params:{slug:slug}
// 		// }).success(function(result){

// 		// 	var data = result;
// 		// });
// 		// return data;

	
// 	}

// 	this.addGuide = function(data) {

// 		return $resource('/app/api/add-guide.php', {}, {
// 			query: {
// 				method:'GET',
// 				params:data,
// 				isArray:true
// 			}
// 		}).query();


// 	}

// 	this.deleteGuide = function(data) {

// 		return $resource('/app/api/delete-guide.php', {}, {
// 			query: {
// 				method:'GET',
// 				params:{id:data},
// 				isArray:true
// 			}
// 		}).query();


// 	}

// });


// App.factory('GuideFactory', function($resource){ 
// 	return {
// 		getGuide: function(slug) {

// 			return $resource('/app/api', {}, {
// 				query: {
// 					method:'GET',
// 					params:{slug:slug},
// 					isArray:false
// 				}
// 			}).query();
// 		}
// 	}
// });