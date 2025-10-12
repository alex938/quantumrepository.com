<?php 
session_start();
if (isset($_SESSION['id']) && isset($_SESSION['username'])) {
?>

<!DOCTYPE html>
<html>

<head>
    <title>Logged in successfully!</title>
</head>

<body>
     <h1>Successfully logged in as: <?php echo $_SESSION['name']; ?></h1>
     Query sent to database: <b><?php echo $_SESSION['sql']; ?></b><br><br>
     The result from the database was: <b><?php echo $_SESSION['result']; ?> row(s)</b><br><br>
     <a href="logout.php">Logout</a>
</body>

</html>

<?php 
}
else
{
     header("Location: index.php");
     exit();
}
?>
