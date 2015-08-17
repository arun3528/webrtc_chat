<?php
   include "classes.php";
   $user = new user();
   //if ($_SERVER["REQUEST_METHOD"] == "POST") {
   if(isset($_POST['UserName']) && isset($_POST['UserMail']) && isset($_POST['UserPassword'])){
      $user->setUserName($_POST['UserName']);
      $user->setUserMail($_POST['UserMail']);
      $user->setUserPassword(sha1($_POST['UserPassword']));
      $user->InsertUser();
      
      header ("Location: ../index.php?success=1");
   }
   //validation 
   //http://www.w3schools.com/php/php_form_url_email.asp
   function test_input($data) {
   	$data = trim($data);
   	$data = stripslashes($data);
   	$data = htmlspecialchars($data);
   	return $data;
   }
?>