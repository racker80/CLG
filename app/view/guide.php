<clg-nav></clg-nav>


<div class="container-fluid">
	<div class="row-fluid">
                

<!-- 
<guide-container>
	<h3>{{guide.title}}</h3>

	<guide-actions ng-click="addGroup()" location="guide.books">add book</guide-actions>
	<br>
	<div ng-repeat="book in guide.books">
			<guide-actions ng-click="addGroup()" location="book.chapters">add chapter</guide-actions>
			<guide-actions ng-click="deleteGroup()" location="book.$index" parent="guide.books">delete book</guide-actions>
	</div>

</guide-container> -->



<div class="span4" >


<guide-container>

	<h2>{{guide.title}}</h2>

	<clg-add-book>
		<!-- <button type="submit" class="btn btn-primary btn-small" ng-click="addBook()">Add Book</button> -->
	</clg-add-book>
				<guide-actions ng-click="addGroup()" location="guide.books">add book</guide-actions>
				<guide-actions ng-click="pasteGroup()" location="guide.books">paste book</guide-actions>

			<a ng-click="edit(guide)">edit</a>

	<hr>


	<accordion close-others="false">

	    <accordion-group ng-repeat="book in guide.books">
			<accordion-heading>
				<div class="accordian-heading-container">
					<h4>{{book.title}}</h4>

					<div class="dropdown">
						<a class="dropdown-toggle">Options</a>
						<ul class="dropdown-menu">
							<li><a guide-actions ng-click="editGroup()" location="book">edit book</a></li>
							<li><a guide-actions ng-click="copyGroup()" location="book">copy book</a></li>
							<li class="divider"></li>

							<li><a guide-actions ng-click="addGroup()" location="book.chapters">new chapter</a></li>
							<li><a guide-actions ng-click="pasteGroup()" location="book.chapters">paste chapter</a></li>

							<li class="divider"></li>

							<li><a guide-actions ng-click="deleteGroup()" location="$index" parent="guide.books">delete book</a></li>

						</ul>
					</div>
				</div>
			</accordion-heading>

<!-- 			<div>
			    <clg-add-chapter book-index="$index">
			    	<a class="label label-info" ng-click="addChapter()">+ Add Chapter</a> |
			    </clg-add-chapter>   
			    <a ng-click="deleteBook($index)">Delete</a> | 
			    <a ng-click="pasteChapter($index)">Paste Chapter</a> | 
			    <a ng-click="edit(book)">edit</a>
			</div> -->

			<dl ng-repeat="chapter in book.chapters">
				<dt>{{chapter.title}} - 
					<a guide-actions ng-click="editGroup()" location="chapter">edit chapter</a> |
					<a guide-actions ng-click="addGroup()" location="book.chapters">add page</a>


<!-- 					<a ng-click="deleteChapter($index, $parent.$index)">Delete</a> | 
					<a ng-click="copyChapter($parent.$index, $index)">copy</a> |
					<a ng-click="pastePage($parent.$index, $index)">paste page</a> |
					<a ng-click="edit(chapter)">edit</a> -->
				</dt>
				
				<dd ng-repeat="page in chapter.pages" ng-init="pageIndex=$index;">
					<span ng-controller="PageController">
<!-- 						<a ng-click="pageUp($parent.$parent.$parent.$index, $parent.$parent.$index)">up</a> 
						<a ng-click="pageDown($parent.$parent.$parent.$index, $parent.$parent.$index)">Down</a>  -->
						{{page.title}}
<!-- 						<a ng-click="deletePageRef($parent.$parent.$parent.$index, $parent.$parent.$index, $index)">delete</a> -->
						<!-- <div ng-bind-html-unsafe="page.content"></div> -->
					</span>
					<a guide-actions ng-click="editGroup()" location="page">edit page</a>
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
</guide-container>

</div>



<div class="span8" ng-show="show" ng-controller="EditorController">
	<h4>Edit</h4>
	
	<clg-editor editor-content="editorContent" editor-type="editorType"></clg-editor>
</div>







	</div>
</div>