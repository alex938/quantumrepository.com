<?php
$host= "database";
$dbuser= "alex";
$dbpassword = "napierassignment";
$dbname = "users";
$conn = mysqli_connect($host, $dbuser, $dbpassword, $dbname);
if (!$conn) {
    echo "Connection failed!";
}

