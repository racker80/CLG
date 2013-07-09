App.factory('SharedServices', function($rootScope, Utils){
	var currentGuide = {};
	var clipboard = {};
	var linkboard = 'test';
	var showEditor = false;
	return {
		setGuide: function(guide) {
			this.currentGuide = guide;
			$rootScope.$broadcast('guideSet');
		},
		guide: function() {
			return this.currentGuide;
		},
		
		copyItem: function(item) {
			var toClipboard = {}

			//avoid linking objects
			angular.copy(item, toClipboard);
			
			this.clipboard = toClipboard;

			$rootScope.$broadcast('copiedItem');
		},
		copiedItem: function() {
			// console.log(this.clipboard)

			return this.clipboard;

		},
		
		linkItem: function(item) {
			this.linkboard = item;
			$rootScope.$broadcast('linkedItem');
		},
		linkedItem: function() {
			return this.linkboard;
		},

		setEditor: function(state) {
			this.showEditor = state;
			$rootScope.$broadcast('editorState');
		},
		editorStatus: function() {
			return this.showEditor;
		}


	}
});




App.factory('PageModel', function($resource, $http, $rootScope, $routeParams, $dialog, Utils){

	return {
		createNewPage: function(data) {
			return $http.get('app/api/add-page.php', {params:{json:angular.toJson(data)}});
		},
		savePage: function(data) {
			if(!data.id) {
				data.id = data._id.$id;
			}
			return $http.get('app/api/save-page.php', {
				params:{
					json:angular.toJson(data)
				}
			});			
		},
		getPageStructure: function() {
			var structure = {
				id:{},
				title:{},
				description:{},
				slug:{},
				content:{},
				tags:[],
				code:[],
			}
			return structure;
		}
	}
});


App.factory('Utils', function($resource, $http, $rootScope, $routeParams, $dialog){
	return {
		makeMarkdown: function(text) {
			var converter = new Showdown.converter();
			if(text) {
				return converter.makeHtml(text);
			}
            
		}
	}
});