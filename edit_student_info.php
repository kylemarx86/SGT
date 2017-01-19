<?php
date_default_timezone_set('America/Los_Angeles');
require_once('mysql_connect.php');

$grade_id = $_POST['id'];
$student_name = $_POST['name'];
$course = $_POST['course'];
$grade = $_POST['grade'];

$data = [];
$data['success'] = false;
$data['errors'] = [];

//attempt to edit the database with new info
$data['success'] = true;
$data['grade_id'] = $grade_id;
$data['student_name'] = $student_name;
$data['course'] = $course;
$data['grade'] = $grade;

$data = json_encode($data);
print $data;

?>