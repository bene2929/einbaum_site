<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "SmartData";

// Create connection
$conn = new mysqli($servername, $username, $password);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
/* Delete Old
$sql = "DROP DATABASE '$dbname'";
if ($conn->query($sql) === TRUE) {
    echo "Database erased <br/>";
} else {
    echo "Database doesn't exist?" . $conn->error . "<br/>";
}*/
$sql = "CREATE DATABASE $dbname";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully";
} else {
    echo "Error creating database: " . $conn->error;
}
$conn = new mysqli($servername, $username, $password,$dbname);
// sql to create table
$sql = "CREATE TABLE Sensors (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
number INT(6) NOT NULL,
type VARCHAR(30) NOT NULL,
status VARCHAR(30) NOT NULL,
valuesBefore TEXT NOT NULL
)";
if ($conn->query($sql) === TRUE) {
    echo "Table sensors created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}
// sql to create table
$sql = "CREATE TABLE LEDs (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
status VARCHAR(30) NOT NULL,
valuesBefore TEXT NOT NULL
)";

if ($conn->query($sql) === TRUE) {
    echo "Table leds created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}
echo("<h2>LED init:</h2>");
$leds=$_POST['ledNumber'];
for($i=0; $i<$leds;$i++){
  $sql = "INSERT INTO leds (status, valuesBefore)
  VALUES ('0', '0')";
  if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}
echo("<h2>Sensor init:</h2>");
$sql = "INSERT INTO sensors (number,type,status, valuesBefore)
VALUES (0,'temp','-1','0');
INSERT INTO sensors (number,type,status, valuesBefore)
VALUES (1,'temp','-1','0');
INSERT INTO sensors (number,type,status, valuesBefore)
VALUES (2,'temp','-1','0');
INSERT INTO sensors (number,type,status, valuesBefore)
VALUES (0,'moist','-1','0');
INSERT INTO sensors (number,type,status, valuesBefore)
VALUES (1,'moist','-1','0');
INSERT INTO sensors (number,type,status, valuesBefore)
VALUES (2,'moist','-1','0');
";
if ($conn->multi_query($sql) === TRUE) {
    echo "Sensors created";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>