<clg-nav></clg-nav>

<div class="container-fluid">
	<div class="row-fluid">
                
		<input type="text" ng-model="filterText">
		<div ng-repeat="content in contents | filter: filterText">
			<li>
				{{content.title}}
<!-- 				<dl>
					<dt>Versioned Content:</dt>
					<dd ng-repeat="version in versions">
						{{version.title}}	
					</dd>
				</dl> -->
			</li>

		</div>


	</div>
</div>