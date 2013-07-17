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

$obj = $container->DataObject();

$obj->Delete(array('name'=>$_REQUEST['name']));

echo 'true';


?>