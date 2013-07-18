<?php
// connect
$m = new MongoClient();

//content collection
$contentCollection = $m->clg->content;

$clgContent = array(

	array(
		'title'=>'Update Ubuntu',
		'content'=>"In order to make sure that your server is up to date, we need it to check for the latest versions of it's installed packages. We do this by first having it create a list of what's installed. To get a list of the installed packages, run the following command:

[code 0]

This has updated the package listing for the operating system to interact with. This information is cached for use by the Aptitude package manager in the future.",
		'code'=>array(
			'sudo apt-get update'
			),
		'tags'=>array(
			'ubuntu',
			'update'
			),
		'type'=>'page',
		'images'=>array(),

		),

	array(
		'title'=>'Upgrade Ubuntu',
		'content'=>"The server can now check for the latest version of the items in the installed packages list. To run this check, enter the below command:

[code 0]

Apt-get will prompt you to review the packages. When asked it you want to continue, enter a capital 'Y’. This step might take several minutes, so kick back while your server does the heavy lifting.

During the update process the OS will appear with a screen like that below. When this appears choose “Install the package maintainers version” to ensure use of the latest version of GRUB.

[image 0]

Once finished let’s reboot the server to ensure you’re running the latest, greatest version with all current packages.

[code 1]",
		'code'=>array(
			'sudo apt-get upgrade',
			'sudo reboot'
			),
		'images'=>array(),
		'tags'=>array(
			'ubuntu',
			'upgrade'
			),
		'type'=>'page',

		)
);

//batch insert
$contentCollection->drop();
$contentCollection->batchInsert($clgContent);





//guide collection
$guideCollection = $m->clg->guides;


$content1 = $contentCollection->findOne(array('title' => 'Update Ubuntu'));
$content2 = $contentCollection->findOne(array('title' => 'Upgrade Ubuntu'));
$guideContent = array(
	array(
		'title'=>'Wordpress Guide',
		'description'=>'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus, officiis, labore, suscipit, veniam qui aliquid error quidem eius illo rerum earum corporis nisi adipisci eum quam est sed pariatur accusamus.',
		'slug'=>'wordpress-guide',
		'type'=>'guide',
		'books'=>array(
			array(
				'title'=>'Server',
				'slug'=>'server',
				'description'=>'some lorem ipsum for the book description',
				'type'=>'book',
				'chapters'=>array(
					array(
						'title'=>'Prepare the OS',
						'slug'=>'prepare-the-os',
						'description'=>'some lorem ipsum for chapter description',
						'type'=>'chapter',
						'pages'=>array(
							array(
								'id'=>$content1['_id'].$id,
								'type'=>'page'
							),
							array(
								'id'=>$content2['_id'].$id,
								'type'=>'page'
							)							
						)
					),
					array(
						'title'=>'Install Wordpress',
						'slug'=>'install-wordpress',
						'description'=>'some lorem ipsum for chapter description',
						'type'=>'chapter',
						'pages'=>array(
							
						)
					),	
					array(
						'title'=>'Create Server Image',
						'slug'=>'create-server-image',
						'description'=>'some lorem ipsum for chapter description',
						'type'=>'chapter',
						'pages'=>array(
							
						)
					),									
				)
			),
			array(
				'title'=>'Database',
				'slug'=>'database',
				'description'=>'some lorem ipsum for the book description',
				'type'=>'book',
				'chapters'=>array(
									
				)
			),
		)

	),
);




//batch insert
$guideCollection->drop();
$guideCollection->batchInsert($guideContent);


//Dupe a doc
$content1['_id'] = new MongoId();
$content1['content'] = "New content for a dupe doc";
$contentCollection->insert($content1, array("safe" => true));




?>
