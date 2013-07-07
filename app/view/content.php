<clg-nav></clg-nav>

<div class="container-fluid">
	<div class="row-fluid">
        
        <input type="text" ng-model="page.title"> <button ng-click="newPage(page)">New Page</button>
<br>
		<div ng-repeat="content in contents | filter: filterText">
			<li>
				{{content.title}} - <a clg-copy-item item="content" ng-click="copyItem()" class="label label-info">Copy</a>
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