
	<div class="row-fluid">
		<div class="span3">
			<clg-side-nav />
		</div>
		<div class="span9">

			<div clg-guide-overview guide="guide"></div>






			<h2>{{guide.title}}</h2>
			<p>{{guide.description}}</p>

			<h3>Books</h3>
			<table class="table well">
				<tbody>
					<tr ng-repeat="book in guide.books">
						<td><a href="#/guides/{{guide.slug}}/books/{{$index}}">{{book.title}}</a></td>
						<td><span ng-click="copyBook($index)" style="cursor:pointer;">copy book</span></td>
						<td>
							<span ng-click="deleteBook($index)" style="cursor:pointer;">delete</span>
						</td>
						<td><div ng-click="indexUp($index)" style="cursor:pointer;">Index up</div></td>
						<td><div ng-click="indexDown($index)" style="cursor:pointer;">Index Down</div></td>
					</tr>
				</tbody>
			</table>

			<span ng-click="pasteBook()" style="cursor:pointer;">paste book</span>
			<form name="addBookForm" class="form" ng-init="">
				<fieldset>
					<div class="control-group">
						<label class="control-label" for="input01">Add Book</label>
						<div class="controls">
							<input ng-model="form.title" type="text" class="input-xlarge" id="input01">


						</div>
						<div class="form-actions">
							<button type="submit" class="btn btn-primary" ng-click="addBook()">Save changes</button>
							<button class="btn">Cancel</button>
						</div>
					</div>
				</fieldset>
			</form>
		</div>
	</div>

	

