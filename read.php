<?php
date_default_timezone_set('America/Los_Angeles');

require_once("mysql_connect.php");
//good query
$query = "SELECT s.name AS student, c.name AS course, g.grade, g.ID
FROM `grades` AS g
JOIN `courses` AS c ON g.course_id = c.ID
JOIN `students` AS s ON g.student_id = s.ID";

//bad query for testing
// $query = "SELECT s.name AS student, c.name AS course, g.grade
// FROM `grades` AS g
// JOIN `courses` AS c ON g.course_id = c.ID
// JOIN `students` AS s ON g.student_id = s.I";      //notice s.ID misspelled on this line

$result = mysqli_query($conn, $query);
$output = [];
$output['success'] = false;
if(mysqli_num_rows($result)){
    $output['success'] = true;
    while($row = mysqli_fetch_assoc($result)){
        $output['data'][] = $row;
    }
}else{
    $output['success'] = false;
    $output['errors'][] = 'Could not complete query.';
}
print(json_encode($output));
?>
