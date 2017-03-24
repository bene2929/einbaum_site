<?php

$servername = "localhost";
$username = "root";
$password = "einbaum";
$dbname = "SmartData";

// Create connection
$conn = new mysqli ( $servername, $username, $password, $dbname );
// Check connection
if ($conn->connect_error) {
	die ( "Connection failed: " . $conn->connect_error );
}
$pos = $_POST ['loc'];
$addr = $_POST ['addr'];
$sql = "INSERT INTO operating_values (id, position, address) VALUES(1, '$pos','$addr') ON DUPLICATE KEY UPDATE    
position='$pos', address='$addr'";
if ($conn->query ( $sql ) === TRUE) {
	echo "New profile/pos successfully";
} else {
	echo "Error updating record: " . $conn->error;
}

$conn->close ();

?>