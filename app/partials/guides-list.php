<div class="container">

	<h2>Guides</h2>
	<table class="table well">
		<tbody>
			<tr ng-repeat="phone in phones">
				<td><a href="#/guides/{{phone.slug}}">{{phone.title}}</a></td>
			</tr>
		</tbody>
	</table>
	


	<form name="addGuideForm" class="form">
		<fieldset>
			<div class="control-group">
				<label class="control-label" for="input01">Add Guide</label>
				<div class="controls">
					<input ng-model="form.title" type="text" class="input-xlarge" id="input01">
				</div>
			<div class="form-actions">
				<button type="submit" class="btn btn-primary" ng-click="addGuide()">Save changes</button>
				<button class="btn">Cancel</button>
			</div>
		</fieldset>
	</form>
</div>
