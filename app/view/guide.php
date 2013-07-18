<global-nav></global-nav>


<div class="container-fluid">
	<div class="row-fluid">
                



<div index-container class="sidebar span3">
	<table class="table">
				<tbody>
					<tr>
						<td edit-item item="catalogue.guide">{{catalogue.guide.title}}</td>
						<td class="dropdown">
							<span class="dropdown-toggle">
								&#9881;
							</span>
							<ul class="dropdown-menu">
								<li>
									<a index-actions type="guide" location="catalogue.guides" target="routeParams.guideIndex" ng-click="removeFromGroup()">Delete Guide</a>
								</li>
								<li>
									<a index-actions type="book" location="catalogue.guide.books" ng-click="addGroupTo()">New Book</a>
								</li>
								<li>
									<a index-actions type="paste" location="catalogue.guide.books" ng-click="addGroupTo()">Paste Book</a>
								</li>										
							</ul>
						</td>
					</tr>
				</tbody>
			</table>
	
	<ul class="indexContainer">
		<li ng-repeat="book in catalogue.guide.books">
			<table class="table">
				<tbody>
					<tr>
						<td edit-item item="book">{{book.title}}</td>
						<td class="dropdown">
							<span class="dropdown-toggle">
								&#9881;
							</span>
							<ul class="dropdown-menu">
								<li>
									<a index-actions ng-click="copy()" target="book">Copy Book</a>
								</li>
								<li>
									<a index-actions location="catalogue.guide.books" target="$index" ng-click="removeFromGroup()">Delete Book</a>
								</li>
								<li>
									<a index-actions type="chapter" location="book.chapters" ng-click="addGroupTo()">New Chapter</a>
								</li>
								<li>
									<a index-actions type="paste" location="book.chapters" ng-click="addGroupTo()">Paste Chapter</a>
								</li>										
							</ul>
						</td>
					</tr>
				</tbody>
			</table>

			<ul>
				<li ng-repeat="chapter in book.chapters">
					<table class="table">
						<tbody>
							<tr>
								<td edit-item item="chapter">{{chapter.title}}</td>
								<td class="dropdown">
									<span class="dropdown-toggle">
										&#9881;
									</span>
									<ul class="dropdown-menu">
										<li>
											<a index-actions ng-click="copy()" target="chapter">Copy Chapter</a>
										</li>
										<li>
											<a index-actions location="book.chapters" target="$index" ng-click="removeFromGroup()">Delete Chapter</a>
										</li>
										<li>
											<a index-actions type="page" location="chapter.pages" ng-click="addNewPage()">New Page</a>
										</li>
										<li>
											<a index-actions type="paste" location="chapter.pages" ng-click="addGroupTo()">Paste Page</a>
										</li>										
									</ul>
								</td>
							</tr>
						</tbody>
					</table>

					
					<ul>
					<li ng-repeat="page in chapter.pages" page-content="page">
						<table class="table">
							<tbody>
								<tr>
									<td edit-item item="page">{{page.title}}</td>
									<td class="dropdown">
										<span class="dropdown-toggle">
											&#9881;
										</span>
										<ul class="dropdown-menu">
											<li>
												<a index-actions ng-click="copy()" target="page">Copy</a>
											</li>
											<li>
												<a>Delete</a>
											</li>											
										</ul>
									</td>
								</tr>
							</tbody>
						</table>

					</li>
					</ul>
				</li>
			</ul>

		</li><!-- book -->

	</ul>


</div>



<div class="editor span9">
	<div clg-editor>

	</div>
</div>







	</div>
</div>