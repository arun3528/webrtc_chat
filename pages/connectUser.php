<?php
   session_start();
   
   include 'classes.php';
   require('Pusher.php');  
   require_once("config.php");
   
   if(isset($_POST['from']) && isset($_POST['description'])&& isset($_POST['to'])) {
//   	 $session = new session();
//   	 $session->setChatUserId($_SESSION['userId']);
//   	 $session->setChatText($_POST['user']);
   	// $session->InsertChatMessage();
   	$pusher = new Pusher(APP_KEY, APP_SECRET, APP_ID);
    $pusher->trigger($_POST['to'], 'my-event', array('message' => $_POST['description'],'from' 
    =>$_POST['from'],'to'=>$_POST['to']) );
   }
?>