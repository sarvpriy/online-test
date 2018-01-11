<?php

header('Access-Control-Allow-Origin: *');

include 'conn.php';

session_start();

$response = [];


$user = User::find_by_username($_POST['user_id']);
echo $user;

// if ($user->username) {
// 	if($_POST['password'] == $user->password) {
// 		$response['status'] = 'loggedIn';
// 		$response['user'] = $user->username;
// 		$response['id'] = md5(uniqid());
// 		$_SESSION['id'] = $response['id'];
// 		$_SESSION['username'] = $user->username;
// 	} else {
// 	    $response['status'] = "Incorrect Password";
// 	}
// }else{
// 	$response['status'] = 'Incorrect username';
// }

// echo json_encode($response);

?>