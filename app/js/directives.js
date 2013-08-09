
App.controller('actionsCtrl', function($scope, DataService, $dialog, $routeParams) {
	$scope.catalogue = DataService;
	$scope.routeParams = $routeParams;

})
App.controller('dialogCtrl', function($scope, $routeParams, DataService, dialog){
	$scope.catalogue = DataService;
	$scope.routeParams = $routeParams;

	$scope.close = function(result){
		dialog.close();
	}
})
App.directive('indexActions', function(DataService, PrepData, $q, $http, $state, $stateParams, $rootScope, $compile, $dialog){
	return {
		restrict:"A",
		scope: {
			type:'@',
			edit:"=",
			location:"=",
			target:"=",
		},
		controller:'actionsCtrl',
		transclude:true,
		template:'<span ng-transclude></span>',
		link: function(scope, element, attrs){
			scope.newGuide = function(edit) {
				DataService.newGuide(edit);
			}
			scope.addNew = function() {
				//Create the location
				if(!angular.isDefined(scope.location)) {
					console.log('location doesnt exist, creating blank array');
					scope.location=[];
				}
				
				//if it's a page, you get a promise back.
				if(scope.type === "page") {
					//run the catalogue addNew
					DataService.addNew(scope.location, scope.type).then(function(d){
						//save the guide
						scope.save();
					});
					return;
				}
				
				//if it's adding an object just do it and save
				DataService.addNew(scope.location, scope.type);
				scope.save();
				
			}
			scope.addExisting = function(){
				DataService.addExisting(scope.location, scope.target);
				//save the guide
				scope.save();
			}
			scope.removeItem = function() {
				DataService.removeItem(scope.location, scope.target);
				//save the guide
				scope.save();
			}
			scope.copy = function() {
				DataService.copy(scope.target);
				//save the guide
				scope.save();
			}
			scope.paste = function() {
				DataService.paste(scope.location);
				//save the guide
				scope.save();				
			}

			scope.save = function(guide) {
				if(!guide) {
					guide = DataService.guide;
				}
				PrepData.prep(guide);
				DataService.saveGuide();
				return;
			}

			// scope.addNewPage = function() {	
			// 	console.log(DataService.newPage(scope.location))
			// 	DataService.newPage(scope.location)
			// 	.then(function(d){
			// 		//save the guide
			// 		console.log('ARGHT!')
			// 		console.log(d)
			// 		scope.save();		
			// 	});	
						
			// }
			scope.deletePage = function() {
				DataService.deletePage(scope.target);
				//save the guide
				scope.save();
		
			}
			scope.deleteGuide = function() {
				DataService.deleteGuide(scope.target)				
			}			





			scope.openDialog = function(type){
				var opts = {
					backdrop: true,
					keyboard: true,
					backdropClick: true,
				    templateUrl:'app/view/templates/directives/modals/'+scope.type+'-modal.html', // OR: templateUrl: 'path/to/view.html',
				    controller: 'dialogCtrl'
				};

				var d = $dialog.dialog(opts);
				d.open().then(function(result){
					console.log(scope)
					console.log(result)
					if(result)
					{
						alert('dialog closed with result: ' + result);
					}
				});
			};			
			scope.openMessageBox = function(){
				var title = 'This is a message box';
				var msg = '';
				var btns = [{result:'cancel', label: 'Cancel'}, {result:'ok', label: 'OK', cssClass: 'btn-primary'}];

				$dialog.messageBox(title, msg, btns)
				.open()
				.then(function(result){
					alert('dialog closed with result: ' + result);
				});
			};
			scope.editItem = function() {
				//save the guide before edit new thing
				scope.save();

				//unselect current edited item;
			    DataService.edit.$active = false;
			    //add the new item
			    DataService.edit = scope.target;
			    scope.target.$active = true;
			    scope.target.$minimized = false;
			    
			    var loc = $stateParams;
			    loc.editId = scope.target.$location;
			    $state.transitionTo('guides.index.edit', loc, true);


				// DataService.saveGuide();
				// DataService.savePage();

				// DataService.edit = scope.target;
				// $state.transitionTo('guides.detail.edit', {index:$stateParams.index, type:scope.target.type, editId:scope.target.$location}, true);

				// // DataService.edit = scope.target;
				// $rootScope.$broadcast('editItem');
			}

			scope.backButton = function() {
				//get the location from stateparams
				var location = $stateParams.editId.split('/');
				//prep it
				location.splice(-2, 1)[0]
				location = location.join('/');
				var loc = $stateParams;
				loc.editId = location;

				//unselect current edited item;
			    DataService.edit.$active = false;
			    DataService.edit.$minimized = true;


				$state.transitionTo('guides.index.edit', loc, true);

			}
			

		}
	}
})






















App.controller('IndexCtrl', function ($scope, DataService) {
	$scope.tasks = DataService.guide;
});

App.directive('collection', function () {
	return {
		restrict: "E",
		replace: true,
		transclude: 'element',
		scope: {
			collection: '='
		},
		template: "<ul class='collection'><member ng-repeat='member in collection' member='member'></member></ul>",
		link:function(scope, element) {
		}
	}
})
App.service('indexState', function(){
	this.minimized = [];
})
App.directive('member', function ($compile, DataService, indexState, $routeParams) {
	return {
		restrict: "E",
		replace: true,
		transclude:'element',
		scope: {
			member: '=',
		},
		template: '<li class="memeber" depth="{{$parent.$index}}" path="" ng-class="{minimized:member.minimized}">'+
		'<a href="#/guide/{{routeParams.guideIndex}}/{{currentLocation}}">{{member.title}}</a></li>',
		link: function (scope, element, attrs) {
			scope.member.minimized = true;


			scope.indexState = indexState;
			console.log(scope.member)
			// if(angular.isDefined(scope.indexState.minimied[scope.$id])) {
			// 	scope.member.minimized = true;
			// } else {
			// 	scope.member.minimized = false;
			// }		
			// scope.$watch('indexState.minimized', function(){
			// 	scope.member.minimized = scope.indexState.minimied[scope.$id];
			// })
			scope.routeParams = $routeParams;
			attrs.path = scope.$parent.$index+'/';

			var parent = element[0].parentNode.parentNode;
			function walk(parent){
				if($(parent).attr('depth')) {
					var a = $(parent).attr('depth');
					attrs.path = a+'/'+attrs.path
					walk(parent.parentNode.parentNode)
				} else {
					return;
				}
			}

			walk(parent);

			scope.currentLocation = attrs.path;

			if (angular.isArray(scope.member.children)) {
				element.prepend("<toggler parent='member'></toggler>");
				element.append("<collection collection='member.children'></collection>"); 
				$compile(element.contents())(scope)
			}
		}
	}
})
App.directive('toggler', function($compile, indexState){
	return {
		restrict: "E",
		replace: true,
		transclude: 'element',
		template:'<span class="toggle" ng-click="toggleMinimized(parent)" ng-switch on="parent.minimized">'+
		'	<span ng-switch-when="true">&#x25B6;</span>'+
		'	<span ng-switch-default>&#x25BC;</span>'+
		'</span>',
		scope: {
			parent:"="
		},
		link: function (scope, element, attrs) {
			scope.toggleMinimized = function (child) {
				child.minimized = !child.minimized;
				console.log(child)

			};

		}
	}
})









