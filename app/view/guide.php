<h1>{{guide.title}}</h1>

<div class="{{template.mainClass}}">
	<div class="well" ng-repeat="book in guide.books">
	<h2>{{book.title}}</h2>
	<a ng-click="deleteBook($index)">Delete</a> | 
	<a ng-click="pasteChapter($index)">Paste Chapter</a> | 
	<a ng-click="edit(book)">edit</a>

	<hr>

		<dl ng-repeat="chapter in book.chapters">
			<dt>{{chapter.title}} - <a ng-click="deleteChapter($index, $parent.$index)">Delete</a> | 
				<a ng-click="copyChapter($parent.$index, $index)">copy</a> |
				<a ng-click="edit(chapter)">edit</a>
			</dt>
			
			<dd ng-repeat="page in chapter.pages" ng-init="pageIndex=$index;">
				<div ng-controller="PageController">

					<a ng-click="pageUp($parent.$parent.$parent.$index, $parent.$parent.$index)">up</a> 
					<a ng-click="pageDown($parent.$parent.$parent.$index, $parent.$parent.$index)">Down</a> 
					{{page.title}}
					<a ng-click="deletePageRef($parent.$parent.$parent.$index, $parent.$parent.$index, $index)">delete</a>
					<a ng-click="edit(page, 'page')">edit</a>
					<!-- <div ng-bind-html-unsafe="page.content"></div> -->
				</div>
				
			</dd>
			<dd>

			<clg-add-page book-index="$parent.$index" chapter-index="$index">
				<form>
					<input ng-model="form.title" type="text" class="input-xlarge" id="">
					<button type="submit" class="btn btn-primary btn-small" ng-click="addPage()">Add Page</button>

				</form>
				
			</clg-add-page>
				

			</dd>
		</dl>

	<hr>

	<clg-add-chapter book-index="$index">
				<form>
					<input ng-model="form.title" type="text" class="input-xlarge" id="">
					<button type="submit" class="btn btn-primary btn-small" ng-click="addChapter()">Add Chapter</button>

				</form>
				
	</clg-add-chapter>


</div>

	<clg-add-book>
				<form>
					<input ng-model="form.title" type="text" class="input-xlarge" id="">
					<button type="submit" class="btn btn-primary btn-small" ng-click="addBook()">Add Book</button>

				</form>
				
	</clg-add-book>
</div>



<div class="{{template.editorClass}}">
	<h4>Edit</h4>
	
	<clg-editor editor-content="editorContent" editor-type="editorType">

		

	</clg-editor>
</div>




