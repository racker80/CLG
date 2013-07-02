<clg-nav></clg-nav>

<div class="container-fluid">
	<div class="row-fluid">
                

		<div ng-repeat="content in contents">
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