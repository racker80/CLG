<?php
// Define the path to the library
//$libPath = '/path/to/php-opencloud';
$libPath = 'opencloud/lib';

// Include the autoloader
require_once $libPath.'/php-opencloud.php';

define('AUTHURL', RACKSPACE_US);
define('USERNAME', 'cloudlaunchguide');
// define('TENANT', '773583');
define('APIKEY', 'ec4f8ebe42cea43c8d68a2b8ef0506da');


// establish our credentials
$connection = new \OpenCloud\Rackspace(AUTHURL,
	array( 'username' => USERNAME,
		   'apiKey' => APIKEY ));

// now, connect to the ObjectStore service
$objstore = $connection->ObjectStore('cloudFiles', 'DFW');

$container = $objstore->Container('clg');



// print_r($_FILES);

$obj = $container->DataObject();
$obj->Create(
	array('name' => $_FILES['file']['name']),
	$_FILES['file']['tmp_name']);


$output = array(
	'url'=>$obj->PublicUrl(),
	'title'=>$obj->Name()
	);
echo json_encode($output);
?>