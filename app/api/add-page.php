<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');
//content collection
$contentCollection = new MongoCollection($db, 'content');

$guideId = $_REQUEST['guideId'];
$bookId = $_REQUEST['bookId'];
$chapterId = $_REQUEST['chapterId'];

unset($_REQUEST['guideId']);
unset($_REQUEST['bookId']);
unset($_REQUEST['chapterId']);


$content = $_REQUEST;

$contentCollection->save($content);


echo json_encode($contentCollection->createDBRef($content));

?>

















































