
<?php
require('Pusher.php');

require_once("config.php");

// TODO: Check for valid POST data

$pusher = new Pusher(APP_KEY, APP_SECRET, APP_ID);
$pusher->trigger($_POST['caller'], 'my-event', array('message' => $_POST['calle']) );
?>