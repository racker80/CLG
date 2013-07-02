<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');
//content collection
$contentCollection = new MongoCollection($db, 'content');




$content = json_decode(stripslashes($_REQUEST['json']));
$contentCollection->save($content);


echo json_encode($contentCollection->createDBRef($content));

?>