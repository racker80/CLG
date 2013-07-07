<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');
//content collection
$collection = new MongoCollection($db, 'content');

// if($_REQUEST['versionedFrom']) {
// 	$cursor = $collection->find(array("versionedFrom" => $_REQUEST['versionedFrom']));

// } else {

$cursor = $collection->find(array("versionedFrom" => array('$exists' => false)));

// }

foreach ($cursor as $item) {
	$output[] = $item;
	//print_r($item);
}

echo json_encode($output);

?>