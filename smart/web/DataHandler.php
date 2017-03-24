<?php
$myfile = fopen("data.txt", "w") or die("Unable to open file!");
$txt = $_POST["suggest"];
fwrite($myfile, $txt);
fclose($myfile);
echo("success");
?>