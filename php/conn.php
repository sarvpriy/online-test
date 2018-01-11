<?php

header('Access-Control-Allow-Origin: *');

require_once 'php-activerecord/ActiveRecord.php';

ActiveRecord\Config::initialize(function($cfg)
{
 $cfg->set_model_directory('models');
 $cfg->set_connections(array(
     'development' => 'mysql://root:@localhost/test'));
});


// $host = 'localhost';
// $dbname = 'laravel';
// $username = 'root'; 
// $password = '';

// try {
// 	$conn = new PDO("mysql:host=$host;dbname=$dbname",$username,$password);
// 	return $conn;
// } catch (PDOException $e) {
// 	return false;
// }




?>