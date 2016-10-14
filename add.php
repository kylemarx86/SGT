<?php
date_default_timezone_set('America/Los_Angeles');

require_once('mysql_connect.php');

//$course = "'5th grade'";
$course = "'wrastling 401'";

$courses_query = "SELECT id FROM `courses` WHERE name=".$course;

$courses_result = mysqli_query($conn, $courses_query);

if(mysqli_num_rows($courses_result)){
    print('we already have a class named '.$course);
//    $new_query = ""
}else{
    echo 'we need to add this class '.$course;
    $add_course_query = "INSERT INTO `courses` SET name = ".$course;
    $new_result = mysqli_query($conn, $add_course_query);

    print(mysqli_insert_id($conn));
}



//mr conners wrestling
?>


