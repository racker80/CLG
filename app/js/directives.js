App.directive('clgSideNav', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/view/directives/sidenav.php',
  };
});



App.directive('clgPageContent', function(UtilFactory) {
  

  function link(scope, element) {

      UtilFactory.getPageFromId(scope.page.id, 'content').success(function(data){
                scope.page = data;
                scope.content = UtilFactory.makeMarkdown(scope.page.content);
                scope.title = scope.page.title;

                angular.forEach(scope.page.code, function(value, key) {
                  scope.content = scope.content.replace('[code '+key+']', '<pre>'+value+'</pre>');
                });

              });

      
  }
  return {
    restrict: 'E',
    templateUrl: 'app/view/directives/page-content.php',
    link:link
    }
});




App.directive('clgFormatContent', function(UtilFactory) {
  function link(scope, elem, attributes) {

        scope.$watch('chapter', function(chapter) {
           if(chapter) {

            scope.chapterContent = UtilFactory.makeMarkdown(chapter.content);


            if(!scope.pages) { scope.pages = []; }

            angular.forEach(chapter.pages, function(value, key) {
              UtilFactory.getPageFromId(value.id, 'content').success(function(data){
                scope.pages.push(data);
              });
            });

          }
        });

      }

    function controller($scope, $element, $attrs, $location) {

    }

    return {
      restrict: 'A',
      scope: {
        chapter:'=',
      },
      link:link,
      controller: controller
    }
});




//GUIDE OVERVIEW
App.directive('clgGuideOverview', function($rootScope, UtilFactory, sharedServices, GuideModel, PageModel) {
  function link(scope, element, attr) {

    scope.$watch('guide', function(guide) {
      if(guide) {
        scope.books = guide.books

        angular.forEach(guide.books, function(book) {

              //loop each chapter
               angular.forEach(book.chapters, function(chapter) {
                
                // loop each page
                angular.forEach(chapter.pages, function(page) {

                    //get the page content 
                    PageModel.getPage({id:page.id, ref:'content'}).success(function(page) {

                      //store page content in service
                      //sharedServices.addPageContent(page);  
                      console.log('stored content')
                      

                    }); 

                });
              });

        });




      }//if guide


      
    });
    
  }
  function controller($scope, $element) {
    $scope.addBookDialog = function() {
      UtilFactory.addBookDialog();
    }
    $scope.addChapterDialog = function(bookIndex) {
      UtilFactory.addChapterDialog(bookIndex);
    }
  }

  return {
    restrict: 'A',
    templateUrl: 'app/view/directives/guide-overview.php',
    scope: {
      guide:'=',
    },
    transclude: true,
    link:link,
    controller:controller
  };
});

//CHAPTER
App.directive('clgGuideOverviewChapters', function(UtilFactory, sharedServices, GuideModel, PageModel) {
  function link(scope, element, attributes) {
    scope.$watch('chapters', function(chapters) {
      
      
    });
  }
  return {
    restrict: 'A',
    templateUrl: 'app/view/directives/guide-overview-chapters.php',
    scope: {
      chapters:'='
    },
    link:link
  };
});

//PAGES
App.directive('clgGuideOverviewPages', function(UtilFactory, sharedServices, GuideModel, PageModel, $rootScope) {
  function link(scope, element, attributes) {
  
    function getPageContent(pages) {
        angular.forEach(pages, function(page) {
            console.log(sharedServices.pageContent)
        });
    }

    scope.$watch('pages', function(pages) {
      if(pages) {
        // angular.forEach(pages, function(value, key) {
        //   PageModel.getPage({id:value.id, ref:'content'}).success(function(data) {
        //     sharedServices.addPageContent(data);           
        //   }); 
        // });
        //scope.$emit('pagesReady');

// loop each page
                angular.forEach(pages, function(value, key) {

                    //get the page content 
                    // PageModel.getPage({id:value.id, ref:'content'}).success(function(data) {
                    //   pages[key] = data;
                    //   //store page content in service
                    //   //sharedServices.addPageContent(page);  
                      
                      

                    // }); 

                });   

                

      }
      
    });
    scope.$on('addedPageContent', function() {

      console.log('got page content')


    });
  }
  return {
    restrict: 'A',
    templateUrl: 'app/view/directives/guide-overview-pages.php',
    scope: {
      pages:'=',
    },
    link:link,
    isolate:true
  };
});










// App.directive('clgPageContent', function(UtilFactory) {
//   var converter = new Showdown.converter();

//   function link(scope, element) {
//       var ref = {
//         ref:'content',
//         id: scope.page
//       }

//       UtilFactory.getPageFromId(scope.page, 'content').success(function(data){
//                 scope.page = data;
//                 scope.page.content = 
//               });

//       PageModel.getPage(ref).success(function(data) {


//         for(var i=0; i<data.code.length; i++) {
//           data.content = data.content.replace('[code '+i+']', '<pre>'+data.code[i]+'</pre>');
//         }

//         scope.pageContent = data;

//         scope.pageContent.content = converter.makeHtml(scope.pageContent.content);


//         console.log();
//       });
//   }
//   return {
//     restrict: 'E',
//     templateUrl: 'app/view/directives/page-content.php',
//     link:link
//     }
// });