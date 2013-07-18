<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');
//content collection
$collection = new MongoCollection($db, 'guides');


$guide = json_decode( stripslashes( urldecode($_REQUEST['json']) ) );

$collection->insert($guide, array("safe" => true));

echo json_encode($guide);

?>