<?php
header('Content-Type: application/json');


// jSON URL which should be requested
$json_url = 'http://192.237.165.197/CLG/app/api/?action=getAll';
// jSON String for request

// Initializing curl
$ch = curl_init( $json_url );

// Configuring curl options
$options = array(
CURLOPT_RETURNTRANSFER => true,
CURLOPT_HTTPHEADER => array('Content-type: application/json') ,
);

// Setting curl options
curl_setopt_array( $ch, $options );
 
// Getting results
$output =  json_decode(curl_exec($ch)); // Getting jSON result string




//Drop the database
$m = new MongoClient();
$db = $m->selectDB('clg');

$collection = new MongoCollection($db, 'guides');
$collection->drop();
//Reformat the guide
foreach($output->guides as $guide) {

	if($guide->books) :
		$guide->children = $guide->books;
		unset($guide->books);
	

		foreach($guide->children as $book) {
			if($book->chapters):
				$book->children = $book->chapters;
				unset($book->chapters);
			

				foreach($book->children as $chapter) {
					if($chapter->pages):
						$chapter->children = $chapter->pages;
						unset($chapter->pages);
					endif;
				}

			else:
				continue;
			endif;


		}
		//REFORMAT DONE



		//insert the guide	
		$guide->_id = new MongoId($guide->id);
		$collection->insert($guide, array("safe" => false));

	endif;


}




// $m = new MongoClient();
// $db = $m->selectDB('clg');



// $json = json_decode(file_get_contents("db.json"));


// $pages = $json->pages;
// $collection = new MongoCollection($db, 'content');
// $collection->drop();
// foreach($pages as $page) {

// 	$page->_id = new MongoId($page->id);

// 	$collection->insert($page, array("safe" => false));
// }



// $guides = $json->guides;
// $collection = new MongoCollection($db, 'guides');
// $collection->drop();
// foreach($guides as $guide) {
// 	$guide->_id = new MongoId($guide->id);
// 	$collection->insert($guide, array("safe" => false));
// }	


?>