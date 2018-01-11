<?php

header('Access-Control-Allow-Origin: *');

include 'conn.php';

session_start();

$response = [];

if (($_POST['username'] != undefined) && ($_POST['email'] != undefined) && ($_POST['phone'] != undefined) && ($_POST['password'] != undefined)) {
	$user = new User;
	$user->username = $_POST['username'];
	$user->email = $_POST['email'];
	// $user->phone = $_POST['phone'];
	$user->password = $_POST['password'];
	if ($user->save()) {
		$response['status'] = 'loggedIn';
		$response['user_id'] = $user->id;
		$response['user'] = $user->username;
		$response['id'] = md5(uniqid());
		$_SESSION['id'] = $response['id'];
		$_SESSION['username'] = $user->username;
		// echo "Registered";

	}else{
		$response['status'] = 'Failed';
	}
}else{
	$response['status'] = "Please Fill All Fields";
}

echo json_encode($response);

// print_r($_POST);


?>