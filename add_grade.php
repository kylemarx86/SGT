<?php
date_default_timezone_set('America/Los_Angeles');
require_once('mysql_connect.php');

//for testing page on its own
//$course = "wrastling 402";
//$student = "Stan Marsh";
//$grade = 60;

//for the real inputs from index page
$student = $_POST['name'];
$course = $_POST['course'];
$grade = $_POST['grade'];

//theory check to see if there is a grade already for a student in a specific class
    //if so return an error
    //if not we can add the info to the database

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
    $add_course_query = "INSERT INTO `courses` SET name = '$course'";
    $add_course_result = mysqli_query($conn, $add_course_query);

    $course_id = mysqli_insert_id($conn);
    $data['course_id'] = $course_id;
}

//get the id of the student
$student_query = "SELECT ID FROM `students` WHERE name = '$student'";
$student_result = mysqli_query($conn, $student_query);

if(mysqli_num_rows($student_result)){
    //we have student in the db already, we need to grab the id
    while($row = mysqli_fetch_assoc($student_result)){
        $student_id = $row['ID'];
    }
}else{
    //insert the student into the db and retrieve the id
    $add_student_query = "INSERT INTO `students` SET name = '$student'";
    $add_student_result = mysqli_query($conn, $add_student_query);

    $student_id = mysqli_insert_id($conn);
    $data['student_id'] = $student_id;
}

if(0 < $grade && $grade <= 100){
    //check to see if student already has a grade for that course
    $grade_check_query = "SELECT * FROM `grades` WHERE `student_id` = '$student_id' AND `course_id` = '$course_id'";
    $grade_check_result = mysqli_query($conn, $grade_check_query);

    if(mysqli_num_rows($grade_check_result)){
        //student already has grade for that class, so we cannot allow a new grade to be written
        $data['success'] = false;
        $data['errors'][] = "Student already has a grade for that class. Try editing the previous course grade.";
    }else{
        //student does not yet have grade for that class, so one needs to be written
        $add_grade_query = "INSERT INTO `grades` SET student_id = '$student_id', course_id = '$course_id', grade = $grade, created = NOW()";
        $add_grade_result = mysqli_query($conn, $add_grade_query);

        if(mysqli_affected_rows($conn)){
            //data was successfully written
            $data['success'] = true;
            $data['new_id'] = mysqli_insert_id($conn);
        }else{
            //could not write data
            $data['success'] = false;
            $data['errors'][] = "Could not write data to db.";
        }
    }
}else{
    $data['success'] = false;
    $data['errors'][] = "That is an invalid grade. Grades need to be between 0 and 100.";
}

$data = json_encode($data);
print($data);

//mr conners wrestling
?>