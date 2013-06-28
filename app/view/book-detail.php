	<div class="row-fluid">
		<div class="span3">
			<clg-side-nav />

		</div>
		<div class="span9">

			<h2>{{guide.title}} - {{guide.books[book].title}}</h2>
			<p>{{guide.description}}</p>

			<span ng-click="copyBook(book)" style="cursor:pointer;">copy book</span>


			<h4>Chapters</h4>
			
			
			<table class="table well">
				<tbody>
					<tr ng-repeat="chapter in guide.books[book].chapters">
						<td><a href="#/guides/{{guide.slug}}/books/{{book}}/chapters/{{$index}}">{{chapter.title}}</a></td>
						<td><span ng-click="copyChapter(book, $index)" style="cursor:pointer;">copy</span></td>
						<td>
							<sapn ng-click="deleteChapter($index)" style="cursor:pointer;">delete</span>
							</td>
					</tr>
				</tbody>
			</table>
			<span ng-click="pasteChapter(book)">paste chapter</span>
			<form name="addBookForm" class="form" ng-init="">
				<fieldset>
					<div class="control-group">
						<label class="control-label" for="input01">Add Chapter</label>
						<div class="controls">
							<input ng-model="form.title" type="text" class="input-xlarge" id="input01">


						</div>
						<div class="form-actions">
							<button type="submit" class="btn btn-primary" ng-click="addChapter()">Save changes</button>
							<button class="btn">Cancel</button>
						</div>
					</div>
				</fieldset>
			</form>			
		</div>
	</div>


