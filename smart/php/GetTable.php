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

$sql = "SELECT id, status,valuesBefore FROM LEDs";
$result = $conn->query ( $sql );

if ($result->num_rows > 0) {
	echo "<table><tr><th>ID</th><th>Status</th></tr>";
	// output data of each row
	while ( $row = $result->fetch_assoc () ) {
		echo "<tr><td>" . $row ["id"] . "</td><td>" . $row ["status"] . " " . $row ["valuesBefore"] . "</td></tr>";
	}
	echo "</table>";
} else {
	echo "0 results";
}
echo ("<h2>Sensors:</h2>");
$sql = "SELECT id, status, type, number, valuesBefore FROM sensors";
$result = $conn->query ( $sql );

if ($result->num_rows > 0) {
	echo "<table><tr><th>ID</th><th>Status</th></tr>";
	// output data of each row
	while ( $row = $result->fetch_assoc () ) {
		echo "<tr><td>" . $row ["id"] . "</td><td>" . $row ["type"] . " " . $row ["number"] . "</td></tr>";
	}
	echo "</table>";
} else {
	echo "0 results";
}
$conn->close ();
?>