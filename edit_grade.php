<?php
date_default_timezone_set('America/Los_Angeles');
require_once('mysql_connect.php');

$grade_id = $_POST['id'];
// $student_name = $_POST['name'];
// $course = $_POST['course'];
$new_grade = $_POST['grade'];

// $grade_id = 68;
// $new_grade = 97;


$data = [];
$data['success'] = false;
$data['errors'] = [];

if(0 < $new_grade && $new_grade <= 100){
    //check to see if the grade is the same as that stored in the db
    $grade_check_query = "SELECT 'grade' FROM `grades` WHERE `ID` = $grade_id";
    $grade_check_result = mysqli_query($conn, $grade_check_query);

    if(mysqli_num_rows($grade_check_result)){
        //student already has grade for that class, so we need to compare the grade to the one already written

        //if the grades are different update with the new grade
        $edit_query = "UPDATE `grades` SET `grade` = '$new_grade' WHERE `grades`.`ID` = '$grade_id'";
        $edit_result = mysqli_query($conn, $edit_query);

        if(mysqli_affected_rows($conn)){
            $data['success'] = true;
            $data['new_grade'] = $new_grade;
        }else{
            $data['success'] = false;
            $data['errors'][] = 'Student already has that grade for that course';
        }
    }else{
        //student does not yet have grade for that class or could not find data
        $data['success'] = false;
        $data['errors'][] = "Could not find data in database to edit.";
    }
}else{
    $data['success'] = false;
    $data['errors'][] = "That is an invalid grade. Grades need to be between 0 and 100.";
}

$data = json_encode($data);
print $data;

?>