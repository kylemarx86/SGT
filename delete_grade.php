<?php
date_default_timezone_set('America/Los_Angeles');
require_once('mysql_connect.php');

//remove
$student_id = $_POST['student_id'];

$data = [];
$data['success'] = false;
$data['errors'] = [];

$remove_student_query = "DELETE FROM `grades` WHERE ID = '$student_id'";
$remove_student_results = mysqli_query($conn, $remove_student_query);

if(mysqli_affected_rows($conn)){
    $data['success'] = true;
}else{
    $data['success'] = false;
    $data['errors'][] = 'Could not remove student';
}

$data = json_encode($data);
print($data);
?>