<?php
      session_start();
?>
<!DOCTYPE html>
<head>
	<link rel="stylesheet" type="text/css" href="../style/style.css">
	<title>Chat Application Home</title>
</head>
<body>
	<h2>Welcome <span style="color:green"><?php  echo $_SESSION['userName']; ?></span></h2>
</br></br>
  <span style="display:none" id='username'><?php  echo $_SESSION['userName']; ?></span>
  <div class='answerCall' style="display:none">
  <button id="receiveCall" name="receiveCall">Receive Call</button>
  <button id="rejectCall" name="rejectCall">Reject Call</button>
	</div>
	<input id="ChatText" name="ChatText"/>
  <button class="btn btn-primary" onclick="connect()" id="dial">Dial</button>
  
  
<video id="remoteVideo" class="video-box col-xs-12  flip-horizontal" autoplay></video>
<video id="localVideo" class="video-box col-xs-12  flip-horizontal" autoplay></video>

	<script src="//js.pusher.com/2.2/pusher.min.js"></script>
	<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'></script>
	<script type="text/javascript" src="../js/adapter.js"></script>
	<script type="text/javascript" src="../js/webrtc.js"></script>
	<script type="text/javascript" src="../js/main.js"></script>
</body>
</html>