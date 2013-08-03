
App.controller('actionsCtrl', function($scope, Catalogue, $dialog, $routeParams) {
	$scope.catalogue = Catalogue;
	$scope.routeParams = $routeParams;

})
App.controller('dialogCtrl', function($scope, $routeParams, Catalogue, dialog){
	$scope.catalogue = Catalogue;
	$scope.routeParams = $routeParams;

	$scope.close = function(result){
		dialog.close();
	}
})
App.directive('indexActions', function(Catalogue, $q, $http, $rootScope, $compile, $dialog){
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

			scope.addNew = function() {
				//Create the location
				if(!angular.isDefined(scope.location)) {
					console.log('location doesnt exist, creating blank array');
					scope.location=[];
				}

				//run the catalogue addNew
				Catalogue.addNew(scope.location, scope.type);
				console.log(scope.catalogue.edit)
				console.log(scope.catalogue.guide)

			}
			scope.addExisting = function(){
				Catalogue.addExisting(scope.location, scope.target);

			}
			scope.removeItem = function() {
				Catalogue.removeItem(scope.location, scope.target);
			}
			scope.copy = function() {
				Catalogue.copy(angular.copy(scope.target));
			}
			scope.paste = function() {
				Catalogue.paste(scope.location);
			}



			scope.addNewPage = function() {	
				Catalogue.newPage(scope.location);	
			}
			scope.deletePage = function() {
				Catalogue.deletePage(scope.target);
			}
			scope.deleteGuide = function() {
				Catalogue.deleteGuide(scope.target)
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
				Catalogue.saveGuide();
				Catalogue.savePage();
				Catalogue.edit = scope.target;
				$rootScope.$broadcast('editItem');
			}
			

		}
	}
})


App.controller('IndexCtrl', function ($scope, Catalogue) {
	$scope.tasks = Catalogue.guide;
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

App.directive('member', function ($compile, Catalogue, $routeParams) {
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
App.directive('toggler', function($compile){
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
			};

		}
	}
})









