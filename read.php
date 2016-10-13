<?php
date_default_timezone_set('America/Los_Angeles');

require_once("mysql_connect.php");
$query = "";

print(json_encode(['success' => true,'data' =>[['id' => 1,'name' => 'Elizabeth','grade' => 89,'course' => 'Library Science']]]));
?>
