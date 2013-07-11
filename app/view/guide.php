<clg-nav></clg-nav>


<div class="container-fluid">
	<div class="row-fluid">


<div class="span4" >


<guide-container>

	<h2>{{guide.title}}</h2>

				<guide-actions ng-click="addGroup()" location="guide.books" type="book" edit="true">add book</guide-actions>
				<guide-actions ng-click="pasteGroup()" location="guide.books">paste book</guide-actions>

			<a guide-actions ng-click="editGroup()" location="guide" type="guide">edit</a>

	<hr>


	<accordion close-others="false">

	    <accordion-group ng-class="{true:'active', false:''}[isOpen]" ng-repeat="book in guide.books">
			<accordion-heading>
				<div class="index-heading">
					<h4>{{book.title}}</h4>

					<div class="dropdown">
						<a guide-actions ng-click="editGroup()" location="book">&#63490;</a>

						<a class="dropdown-toggle">&#9881;</a>
						<ul class="dropdown-menu">
							<li><a guide-actions ng-click="copyGroup()" location="book">copy book</a></li>
							<li class="divider"></li>

							<li><a guide-actions ng-click="addGroup()" location="book.chapters" type="chapter" edit="true">new chapter</a></li>
							<li><a guide-actions ng-click="pasteGroup()" location="book.chapters">paste chapter</a></li>

							<li class="divider"></li>

							<li><a guide-actions ng-click="deleteGroup()" location="$index" parent="guide.books">delete book</a></li>

						</ul>
					</div>
				</div>
			</accordion-heading>


			<dl ng-repeat="chapter in book.chapters">
				<dt class="index-heading">
					<a guide-actions ng-click="indexUp()" location="$index" parent="book.chapters">&#11014;</a>
					<a guide-actions ng-click="indexDown()" location="$index" parent="book.chapters">&#11015;</a>
					{{chapter.title}}
						<div class="dropdown">
							<a guide-actions ng-click="editGroup()" location="chapter">&#63490;</a> 
							<a class="dropdown-toggle">&#9881;</a>
							<ul class="dropdown-menu">
								<li><a guide-actions ng-click="copyGroup()" location="chapter">copy chapter</a></li>
								<li><a guide-actions ng-click="deleteGroup()" location="$index" parent="book.chapters">delete chapter</a></li>
								<li class="divider"></li>

								<li><a guide-actions ng-click="addGroup()" location="chapter.pages" type="page">add page</a></li>
								<li><a guide-actions ng-click="pasteGroup()" location="book.chapters">paste page</a></li>
							</ul>
						</div>
				</dt>
				
				<dd ng-repeat="page in chapter.pages" ng-init="pageIndex=$index;">
					<div class="index-heading">
					<span ng-controller="PageController">{{page.title}}</span>
						<div class="dropdown">
							<a guide-actions ng-click="editGroup()" location="page">&#63490;</a>
							<a class="dropdown-toggle">&#9881;</a>
							<ul class="dropdown-menu">
								<li><a guide-actions ng-click="copyGroup()" location="page">copy page</a></li>
								<li><a guide-actions ng-click="deleteGroup()" location="$index" parent="book.chapters">delete page</a></li>
							</ul>
						</div>										
					</div>
				</dd>

			</dl>

			<hr>




	    </accordion-group>
  
 	 </accordion>
</guide-container>

</div>


<div class="span8">
		<!-- <div ng-include src="'app/view/directives/editor.php'"></div> -->


			<editor-container ng-include src="editorTemplateUrl"></editor-container>

</div>

<!-- <div class="span8" ng-show="show" ng-controller="EditorController">
	<h4>Edit</h4>
	
	<clg-editor editor-content="editorContent" editor-type="editorType"></clg-editor>
</div> -->







	</div>
</div>