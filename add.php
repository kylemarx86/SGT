<?php
date_default_timezone_set('America/Los_Angeles');

require_once('mysql_connect.php');

$course = "'wrastling 402'";
$student = "'Token Black'";
$grade = '60';

$course_query = "SELECT ID FROM `courses` WHERE name=".$course;
$course_result = mysqli_query($conn, $course_query);

if(mysqli_num_rows($course_result)){
    print('we already have a class named '.$course);
//    $new_query = ""
}else{
    echo 'we need to add this class '.$course;
    $add_course_query = "INSERT INTO `courses` SET name = ".$course;
    $new_result = mysqli_query($conn, $add_course_query);

    print("<br>".mysqli_insert_id($conn));
}

$student_query = "SELECT ID FROM `students` WHERE name = ".$student;
$student_result = mysqli_query($conn, $student_query);

if(mysqli_num_rows($student_result)){
    print('<br>we already have a student named '.$student);
}else{
    print('we need to add this student: '.$student);
    $add_student_query = "INSERT INTO `students` SET name = ".$student;
    $add_student_result = mysqli_query($conn, $add_student_query);
    print("<br>".mysqli_insert_id($conn));
}

if(0 < $grade && $grade <= 100){
    $add_grade_query;       //add stuffs here
    $add_grade_result;      //add stuffs here
}else{
    print("<br>that is an invalid grade.");
}

//mr conners wrestling
?>


