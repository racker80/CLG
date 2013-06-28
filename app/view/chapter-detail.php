	<div class="row-fluid">
		<div class="span3">
			<clg-side-nav />
		</div>
		<div class="span9">
			<h2>{{guide.title}} - {{guide.books[book].title}} - {{guide.books[book].chapters[chapter].title}}</h2>
			
			<div clg-format-content chapter="guide.books[book].chapters[chapter]" >
				<div ng-bind-html-unsafe="chapterContent"></div>
				<div ng-repeat="page in pages">
					<p>available code - {{page.title}}</p>
					<div ng-repeat="code in page.code"><pre>{{code}}</p></div>
				</div>
			</div>
			
			<a href="#/guides/{{guide.slug}}/books/{{book}}/chapters/{{chapter}}/edit">edit</a>
			<span ng-click="copyChapter(book, chapter)" style="cursor:pointer;">copy</span>
			

			<h4>Pages</h4>
			
			<!-- {{guide.books[book.bookId].chapters[chapter.chapterId].pages}} -->

				
				<clg-page-content ng-repeat="page in guide.books[book].chapters[chapter].pages" ></clg-page-content>


<!-- 			<table class="table well">
				<tbody>
					<tr ng-repeat="page in pages">
						<td>
							<h3>{{page.title}}</h3>
							<p>{{page.content}}</p>
							<sapn ng-click="deletePageRef($index)" style="cursor:pointer;">delete</span>
							</td>
						</tr>
					</tbody>
				</table> -->
				<form name="addBookForm" class="form" ng-init="">
					<fieldset>
						<div class="control-group">
							<label class="control-label" for="input01">Add Page</label>
							<div class="controls">
								<input ng-model="form.title" type="text" class="input-xlarge" id="input01">
								<br>
								<textarea ng-model="form.content" ></textarea>


							</div>
							<div class="form-actions">
								<button type="submit" class="btn btn-primary" ng-click="createNewPage()">Save changes</button>
								<button class="btn">Cancel</button>
							</div>
						</div>
					</fieldset>
				</form>

				<div>
					
					<h3>Content</h3>
					<ul>
						<li ng-repeat="content in moreContent">
							<span ng-click="addPageRef(content._id.$id)" style="cursor:pointer;">{{content.title}}</span>
						</li>
					</ul>

				</div>

		</div>
	</div>

