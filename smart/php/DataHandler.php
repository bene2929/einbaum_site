<?php
$name = $_POST ['fileN'];
echo ("$name\n");
$myfile = fopen ( "$name", "w" ) or die ( "Unable to open file!" );
$txt = $_POST ['msg'];
fwrite ( $myfile, $txt );
fclose ( $myfile );
echo ("written" + "msg");
?>