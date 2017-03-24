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
$status = $_POST ['status'];
$id = $_POST ['id'];
$sql = "UPDATE leds SET status='$status' WHERE id='$id'";

if ($conn->query ( $sql ) === TRUE) {
	echo "Record updated successfully";
} else {
	echo "Error updating record: " . $conn->error;
}

$conn->close ();

?>