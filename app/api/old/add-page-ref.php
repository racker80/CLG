<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');


$guideCollection = new MongoCollection($db, 'guides');

$guide = $guideCollection->findOne(array("_id"=>new MongoId($_REQUEST['guideId'])));

$guide['books'][$_REQUEST['bookId']]['chapters'][$_REQUEST['chapterId']]['pages'][] = $contentCollection->createDBRef($_REQUEST['contentId']);

$guideCollection->save($guide);

echo json_encode($guide);

?>