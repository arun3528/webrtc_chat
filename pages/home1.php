<?php
      session_start();
?>
<!DOCTYPE html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="../css/bootstrap.min.css">

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <!-- Latest compiled and minified JavaScript -->
  <script src="../js/bootstrap.min.js"></script>

	<link rel="stylesheet" type="text/css" href="../style/style.css">
	<title>Chat Application Home</title>
</head>
<body>
<nav class="navbar navbar-default">
  <div class="container-fluid">
     <label class="navbar-text pull-right" style="color:black"><small>Welcome </small><?php  echo $_SESSION['userName'];?></label>
     
    <div class="navbar-header">
    
      <a class="navbar-brand" href="#">
        <label>webrtc</label> 
           </a>
             
    </div>
  </div>
</nav>
<div class="container">
	 <label id="username" style="display:none"><?php  echo $_SESSION['userName']; ?></label>
  <div class='answerCall pull-right' style="display:none">
  <button class="btn btn-primary" id="receiveCall" name="receiveCall">Receive Call</button>
  <button class="btn btn-primary" id="rejectCall" name="rejectCall">Reject Call</button>
	</div>
	<div class="form-inline">
	<!-- TODO: Change the name --> 
     	<input id="ChatText" type='text' name="ChatText" placeholder="UserId"/>
      <button class="btn btn-primary" onclick="connect()" id="dial">Dial</button>
  </div> 
  <div>
    <video id="remoteVideo" class="video-box col-xs-12  embed-responsive embed-responsive-4by3" autoplay></video>
    <video id="localVideo" class="video-box col-xs-12  embed-responsive embed-responsive-4by3" autoplay></video>
  </div>
</div>
	<script src="//js.pusher.com/2.2/pusher.min.js"></script>
	<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'></script>
	<script type="text/javascript" src="../js/adapter.js"></script>
	<script type="text/javascript" src="../js/webrtc.js"></script>
	<script type="text/javascript" src="../js/main.js"></script>
</body>
</html>