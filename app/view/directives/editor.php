<a ng-click="versionPage()">Version Page</a>
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
						<textarea type="text" ng-model="editorContent.content" rows="10" style="width:500px"></textarea>

						<h4>Code</h4>
						<div ng-repeat="item in editorContent.code">
							<pre>{{item}}</pre>
						</div>
						<textarea class="textarea" ng-model="addCodeForm" rows="5"></textarea> <button class="btn" ng-click="addCode(addCodeForm)">Add Code</button>

					</tab>
					<tab heading="Preview">
						<div ng-bind-html-unsafe="previewContent"></div>
					</tab>
					<tab heading="Meta">
						<form class="form-horizontal">
							<div class="control-group">
								<label class="control-label" for="inputEmail">tags</label>
								<div class="controls">
									<input type="text" ng-model="meta.tag"> 
									<button class="btn" ng-click="addMetaTag(meta.tag)">Add</button>
								</div>
								<div>
									<pre ng-repeat="tag in editorContent.tags">{{tag}}</pre>
								</div>
							</div>
							<div class="control-group">
								<label class="control-label" for="inputEmail">other</label>
								<div class="controls">
									<input type="text" ng-model="meta.other">
									<button class="btn" ng-click="addMetaOther(meta.other)">Add</button>

								</div>
								<div>
									<pre ng-repeat="other in editorContent.other">{{other}}</pre>
								</div>
							</div>							
						</form>

					</tab>
					
				</tabset>


				
			</div>			
		</form>

		<button type="submit" class="btn btn-primary btn-small" ng-click="save()">Save</button>

		
		


