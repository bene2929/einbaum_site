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

$sql = "SELECT id, status,type,number, valuesBefore FROM sensors";
$result = $conn->query ( $sql );

if ($result->num_rows > 0) {
	// output data of each row
	while ( $row = $result->fetch_assoc () ) {
		echo $row ["type"] . "" . $row ["number"] . ";" . $row ["status"] . ";" . $row ["valuesBefore"] . "\n";
	}
} else {
	echo "";
}

$conn->close ();

?>