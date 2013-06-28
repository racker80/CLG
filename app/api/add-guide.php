<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');
//content collection
$collection = new MongoCollection($db, 'guides');

$guide = $_REQUEST;

$collection->insert($guide, array("safe" => true));

echo json_encode($guide);

?>