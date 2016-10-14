<?php
date_default_timezone_set('America/Los_Angeles');

require_once("mysql_connect.php");
$query = "SELECT s.name AS student, c.name AS course, g.grade 
FROM `grades` AS g
JOIN `courses` AS c ON g.course_id = c.ID
JOIN `students` AS s ON g.student_id = s.ID";

$result = mysqli_query($conn, $query);
//print_r($result);
//print($query);
$output = [];
$output['success'] = false;
if(mysqli_num_rows($result)){
    $output['success'] = true;
    while($row = mysqli_fetch_assoc($result)){
        $output['data'][] = $row;
    }
}
print(json_encode($output));
//print(json_encode($result));
//print(json_encode(['success' => true,'data' =>[['id' => 1,'name' => 'Elizabeth','grade' => 89,'course' => 'Library Science']]]));
?>
