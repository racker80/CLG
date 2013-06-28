<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');
//content collection
$collection = new MongoCollection($db, 'guides');

$d = $collection->remove(array("_id"=>new MongoId($_GET['id'])), array("safe" => true));

echo json_encode($d);

?>