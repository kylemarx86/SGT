<?php
date_default_timezone_set('America/Los_Angeles');
require_once('mysql_connect.php');

$course = "wrastling 402";
$student = "Stan Marsh";
$grade = 60;
//$student = $_POST['name'];
//$course = $_POST['course'];
//$grade = $_POST['grade'];

//theory check to see if there is a grade already for a student in a specific class
    //if so return an error
    //if not we can add the info to the database
//$check_query = "SELECT ID FROM `courses` WHERE name=";

$data = [];
$data['success'] = false;
$data['errors'] = [];

//get the id of the course
$course_query = "SELECT ID FROM `courses` WHERE name='$course'";
$course_result = mysqli_query($conn, $course_query);

if(mysqli_num_rows($course_result)){
    //we have class listed already, we need to grab the id
    while($row = mysqli_fetch_assoc($course_result)){
        $course_id = $row['ID'];
    }
}else{
    //insert the course into the db and retrieve the id
    //    echo 'we need to add this class '.$course;    //temp while testing
    $add_course_query = "INSERT INTO `courses` SET name = '$course'";
    $add_course_result = mysqli_query($conn, $add_course_query);

//    print("<br>".mysqli_insert_id($conn));    //temp while testing
    $course_id = mysqli_insert_id($conn);
    $data['course_id'] = $course_id ;   //temp while testing?????
}

//get the id of the student
$student_query = "SELECT ID FROM `students` WHERE name = '$student'";
$student_result = mysqli_query($conn, $student_query);

if(mysqli_num_rows($student_result)){
    //we have student in the db already, we need to grab the id
    while($row = mysqli_fetch_assoc($student_result)){
        $student_id = $row['ID'];
    }
    echo $student_id;
}else{
    //insert the student into the db and retrieve the id
    $add_student_query = "INSERT INTO `students` SET name = '$student'";
    $add_student_result = mysqli_query($conn, $add_student_query);

    $student_id = mysqli_insert_id($conn);
//    $data['student_id'] = $student_id;
}

//the query writes but the student_id and course_id always seem to be 0
    //need to further investigate the mysqli_insert_id
if(0 < $grade && $grade <= 100){
    //if all other parts are successful write the addition to the grades table
    $add_grade_query = "INSERT INTO `grades` SET student_id = '$student_id', course_id = '$course_id', grade = $grade, created = NOW()";
    $add_grade_result = mysqli_query($conn, $add_grade_query);

    if(mysqli_num_rows($add_grade_result)){
        $data['success'] = true;
        $data['new_id'] = mysqli_insert_id($conn);
    }
}else{
    $data['success'] = false;
    $data['errors'][] = "That is an invalid grade.";
}

$data = json_encode($data);
print($data);

//old old old

//$student_query = "SELECT ID FROM `students` WHERE name = ".$student;
//$student_result = mysqli_query($conn, $student_query);
//
//if(mysqli_num_rows($student_result)){
//    print('<br>we already have a student named '.$student);
//}else{
//    print('we need to add this student: '.$student);
//    $add_student_query = "INSERT INTO `students` SET name = ".$student;
//    $add_student_result = mysqli_query($conn, $add_student_query);
//    print("<br>".mysqli_insert_id($conn));
//}
//
//if(0 < $grade && $grade <= 100){
//    $add_grade_query;       //add stuffs here
//    $add_grade_result;      //add stuffs here
//}else{
//    print("<br>that is an invalid grade.");
//}

//mr conners wrestling
?>