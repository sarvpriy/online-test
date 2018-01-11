<?php

header('Access-Control-Allow-Origin: *');
include 'conn.php';
session_start();

// $response = [];

$userAns = $_POST['userAns'];

$que = Question::find_by_id($_POST['dbid']);

if ($que->ans === $userAns) {
    echo "Correct";
}else{
    echo "Wrong";
}

?>