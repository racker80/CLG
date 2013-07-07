<clg-nav></clg-nav>


<div class="container-fluid">
	<div class="row-fluid">
                



<div class="span4" ng-controller="GuidesController">
	<h2>{{guide.title}}</h2>

	<clg-add-book>
		<button type="submit" class="btn btn-primary btn-small" ng-click="addBook()">Add Book</button>
	</clg-add-book>
			<a ng-click="edit(guide)">edit</a>

	<hr>


	<accordion close-others="false">

	    <accordion-group heading="{{book.title}}" ng-repeat="book in guide.books">
			<div>
			    <clg-add-chapter book-index="$index">
			    	<a class="label label-info" ng-click="addChapter()">+ Add Chapter</a> |
			    </clg-add-chapter>   
			    <a ng-click="deleteBook($index)">Delete</a> | 
			    <a ng-click="pasteChapter($index)">Paste Chapter</a> | 
			    <a ng-click="edit(book)">edit</a>
			</div>

			<dl ng-repeat="chapter in book.chapters">
				<dt>{{chapter.title}} - <a ng-click="deleteChapter($index, $parent.$index)">Delete</a> | 
					<a ng-click="copyChapter($parent.$index, $index)">copy</a> |
					<a ng-click="pastePage($parent.$index, $index)">paste page</a> |
					<a ng-click="edit(chapter)">edit</a>
				</dt>
				
				<dd ng-repeat="page in chapter.pages" ng-init="pageIndex=$index;">
					<span ng-controller="PageController">
						<a ng-click="pageUp($parent.$parent.$parent.$index, $parent.$parent.$index)">up</a> 
						<a ng-click="pageDown($parent.$parent.$parent.$index, $parent.$parent.$index)">Down</a> 
						{{page.title}}
						<a ng-click="deletePageRef($parent.$parent.$parent.$index, $parent.$parent.$index, $index)">delete</a>
						<!-- <div ng-bind-html-unsafe="page.content"></div> -->
					</span>
					<a ng-click="edit(page, 'page')">edit</a>
				</dd>
				<dd>				
					<clg-add-page book-index="$parent.$index" chapter-index="$index">
						<span class="label label-info" ng-click="addPage()">+ Add Page</span>			
					</clg-add-page>				
				</dd>
			</dl>

			<hr>




	    </accordion-group>
  
 	 </accordion>

</div>



<div class="span8" ng-show="show" ng-controller="EditorController">
	<h4>Edit</h4>
	
	<clg-editor editor-content="editorContent" editor-type="editorType"></clg-editor>
</div>







	</div>
</div>