<?php
session_start();

// ini_set('session_cookie_httponly', true);

if(isset($_SESSION[last_ip]) === false) {
	$_SESSION['last_ip'] = $_SERVER['REMOTE_ADDR'];
}

if($_SESSION['last_ip']  !== $_SERVER['REMOTE_ADDR']) {
	session_unset();
	session_destroy();
}
  include "classes.php";
  
     $user = new user();
     $user->setUserMail($_POST['UserMailLogin']);
     $user->setUserPassword(sha1($_POST['UserPasswordLogin']));
     echo session_id();
     $user->setSessionId(session_id());
     if($user->UserLogin() == true){
     	$_SESSION["userId"]=$user->getUserId();
     	$_SESSION["userName"]=$user->getUserName();
     	$_SESSION["userMail"]=$user->getUserMail();
     }
?>