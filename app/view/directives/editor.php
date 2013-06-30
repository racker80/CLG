
<form class="form-inline">
			<div class="control-group">
				<label class="control-label" for="inputEmail">Title</label>
				<div class="controls">
					<input type="text" ng-model="editorContent.title">
				</div>
			</div>
			<div class="control-group">

				<tabset>
					<tab heading="Editor">
						<textarea type="text" ng-model="editorContent.content"></textarea>
					</tab>
					<tab heading="Preview">
						<div ng-bind-html-unsafe="previewContent"></div>
					</div>
					
				</tabset>


				
			</div>			
		</form>

		<button type="submit" class="btn btn-primary btn-small" ng-click="save()">Save</button>