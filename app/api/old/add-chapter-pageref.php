<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');
//content collection
$contentCollection = new MongoCollection($db, 'content');

$guideId = $_REQUEST['guideId'];
$bookId = $_REQUEST['bookId'];
$chapterId = $_REQUEST['chapterId'];

$content = new mongoId($_REQUEST['contentId']);



$guideCollection = new MongoCollection($db, 'guides');

$guide = $guideCollection->findOne(array("_id"=>new MongoId($_REQUEST['guideId'])));

$guide['books'][$_REQUEST['bookId']]['chapters'][$_REQUEST['chapterId']]['pages'][] = $contentCollection->createDBRef($content);

$guideCollection->save($guide);

echo json_encode($content);


?>