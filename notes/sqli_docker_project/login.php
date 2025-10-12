<?php
session_start();
include "dbconn.php";

$uname = $_POST['uname'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE username='$uname' AND password='$password'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) == 1) 
{
	$row = mysqli_fetch_assoc($result);
		if ($row['username'] == $uname && $row['password'] == $password) {
                $_SESSION['username'] = $row['username'];
                $_SESSION['name'] = $row['name'];
                $_SESSION['id'] = $row['id'];

                $_SESSION['sql'] = $sql;
                $_SESSION['result'] = mysqli_num_rows($result);

                header("Location: secret.php");
                exit();
        }
}
else
{   
    echo "<title>Login Incorrect</title>";
    echo "<h1>Login Incorrect</h1>";
    echo "Query sent to database: <b>$sql</b><br><br>";
    echo "The result from the database was: <b>".mysqli_num_rows($result)." row(s)</b>";
}
