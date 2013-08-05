App.directive('ezTree', function ($compile, $timeout) {

  return {
    restrict: 'A',
    transclude: 'element',
    priority: 1000,
    terminal: true,
    compile: function (tElement, tAttrs, transclude) {

      var repeatExpr,
      childExpr,
      rootExpr,
      childrenExpr;

      repeatExpr = tAttrs.ezTree.match(/^(.*) in ((?:.*\.)?(.*)) at (.*)$/);
      childExpr = repeatExpr[1];
      rootExpr = repeatExpr[2];
      childrenExpr = repeatExpr[3];
      branchExpr = repeatExpr[4];

      return function link(scope, element, attrs) {
        var rootElement = element[0].parentNode,
          cache = [];
        // Reverse lookup
        function lookup(child) {
          var i = cache.length;
          while (i--) {
            if (cache[i].scope[childExpr] === child) {
              return cache.splice(i, 1)[0];
            }
          }
        }

        scope.$watch(rootExpr, function (root) {

          var currentCache = [];

          // Recurse the data structure
          (function walk(children, parentNode, depth) {

            var i = 0,
              n = children.length,
              child,
              cached,
              cursor,
              grandchildren;
          

            // Iterate the children at the current level
            for (; i < n; ++i) {

              child = children[i];

              // See if this child has been previously rendered
              // using a reverse lookup by object reference
              cached = lookup(child);

              // If it has not, render a new element and prepare its scope
              // We also cache a reference to its branch node which will
              // be used as the parentNode in the next level of recursion
              if (!cached) {
                transclude(scope.$new(), function (clone, childScope) {
                  child.$minimized = true;
                  childScope[childExpr] = child;
                  cached = {
                    scope: childScope,
                    element: clone[0],
                    branch: clone.find(branchExpr)[0]
                  };
                });
              }

              // Store the current depth on the scope in case you want 
              // to use it (for good or evil, no judgment).
              cached.scope.$depth = depth;


              // We will compare the cached element to the element in 
              // at the destination index. If it does not match, then 
              // the cached element is being moved into this position.
              cursor = parentNode.childNodes[i];
              if (cached.element !== cursor) {
                parentNode.insertBefore(cached.element, cursor);
              }

              // Push the object onto the new cache which will replace
              // the old cache at the end of the walk.
              currentCache.push(cached);

              // If the child has children of its own, recurse 'em.             
              grandchildren = child[childrenExpr];
              if (grandchildren && grandchildren.length) {
                child.$children = true;
                walk(grandchildren, cached.branch, depth + 1);
              }
            }
          })(root, rootElement, 0);

          // Cleanup objects which have been removed.
          // Remove DOM elements and destroy scopes to prevent memory leaks.
          i = cache.length;
          while (i--) {
            cache[i].element.remove();
            cache[i].scope.$destroy();
          }

          // Replace previous cache.
          cache = currentCache;

        }, true);
      };
    }
  };
});


App.controller('TreeController', function ($scope, $timeout, $state, $stateParams, DataService) {

  var makeLocation = function(parent, parentLocation){
      if(!parent.children) {
        return;
      }
      if(!parentLocation) {
        parentLocation = '';
      }
      _.each(parent.children, function(value, key, list){
              if(!value.childtype) {
                value.childtype = angular.copy(DataService.structure[value.type].childtype);
              }

              list[key].$location = parentLocation+key+'/';
              if(value.children) {
                makeLocation(value, list[key].$location);
              }

       });
  }
  makeLocation(DataService.guide)
  $scope.guide = DataService.guide;
  $scope.$on('somethingChanged', function() {

    console.log('Doing object context location...')
    makeLocation(DataService.guide)
  })


    $scope.sortableOptions = {
      // listType: 'ol',
      // items: 'li',
    start: function(e, ui) {
         console.log(ui.item)

    },
    stop: function(e, ui) {
      // console.log()
        DataService.saveGuide();

    },
      update: function(e, ui) {
      },
      
  };

  $scope.edit = function(child) {
    DataService.edit.$active = false;
    DataService.edit = child;
    child.$active = true;
    child.$minimized = false;
    console.log($state.current)
    $state.transitionTo('guides.detail.edit', {index:$stateParams.index, type:child.type, editId:child.$location}, true);
  }

  $scope.toggleMinimized = function (child) {
    child.$minimized = !child.$minimized;
  };
  $scope.addChild = function (child) {
    child.children.push({
      title: '',
      children: []
    });
  };

  $scope.remove = function (child) {
    function walk(target) {
      var children = target.children,
        i;
      if (children) {
        i = children.length;
        while (i--) {
          if (children[i] === child) {
            return children.splice(i, 1);
          } else {
            walk(children[i])
          }
        }
      }
    }
    walk($scope.data);
  }

  $scope.update = function (event, ui) {

    var root = event.target,
      item = ui.item,
      parent = item.parent(),
      target = (parent[0] === root) ? $scope.data : parent.scope().child,
      child = item.scope().child,
      index = item.index();

    target.children || (target.children = []);

    function walk(target, child) {
      var children = target.children,
        i;
      if (children) {
        i = children.length;
        while (i--) {
          if (children[i] === child) {
            return children.splice(i, 1);
          } else {
            walk(children[i], child)
          }
        }
      }
    }
    walk($scope.data, child);

    target.children.splice(index, 0, child);
  };

});


App.directive('uiNestedSortable', ['$parse', function ($parse) {

  'use strict';

  var eventTypes = 'Create Start Sort Change BeforeStop Stop Update Receive Remove Over Out Activate Deactivate'.split(' ');

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      // var options = attrs.uiNestedSortable ? $parse(attrs.uiNestedSortable)() : {};
      // angular.forEach(eventTypes, function (eventType) {

      //   var attr = attrs['uiNestedSortable' + eventType],
      //     callback;

      //   if (attr) {
      //     callback = $parse(attr);
      //     options[eventType.charAt(0).toLowerCase() + eventType.substr(1)] = function (event, ui) {
      //       scope.$apply(function () {

      //         callback(scope, {
      //           $event: event,
      //           $ui: ui
      //         });
      //       });
      //     };
      //   }

      // });
      // console.log(element)
      // element.nestedSortable(options);

    }
  };
}]);