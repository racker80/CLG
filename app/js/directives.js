
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
			scope.addGroupTo = function() {
				if(scope.type == 'paste') {
					scope.location.push(Catalogue.copy);
					scope.catalogue.copy = '';
					Catalogue.saveGuide();

				} 
				else if(scope.type=="page") {
					$http.post('app/api/post.php', {
						collection:'content',
						action:'addPage',
						json:Catalogue.structure.page,
					}).success(function(data){
						Catalogue.pages[data.id] = data;
						scope.location.push(Catalogue.pages[data.id]);
						Catalogue.saveGuide();
					});			
				}
				else {
					scope.location.push(Catalogue.structure[scope.type]);
					Catalogue.saveGuide();

				}

				//TODO DELETE GUIDE!

			}
			scope.removeFromGroup = function() {
				scope.location.splice(scope.target, 1);
				Catalogue.saveGuide();
			}
			scope.addNewPage = function() {
				$http.post('app/api/index.php', {
						collection:'content',
						action:'addPage',
						json:Catalogue.structure.page,
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




			scope.openDialog = function(type){
				var opts = {
					backdrop: true,
					keyboard: true,
					backdropClick: true,
				    templateUrl:'app/view/templates/directives/modals/'+type+'-modal.html', // OR: templateUrl: 'path/to/view.html',
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




