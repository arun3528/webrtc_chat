


$(document).ready(function () {
  $('.answerCall').toggle(false);
  
  $('#receiveCall').on('click', function () {
    receiveCall();
  });

  $("#login-button").click(function(event){
    event.preventDefault();

    //$('form').fadeOut(500);
    //$('.wrapper').addClass('form-success');
  });
});

  var username, localVideo, remoteVideo, pusher, remoteSdp, peer, peerConnection = null;
  //function connectWithMediaStream(connectOpts, errorCallback) {

    // when on-add stream gets triggred
    //userMediaSvc.showStream({
    //  stream: data.stream,
    //  localOrRemote: 'remote'
    //});
  pusher = new Pusher('5616efde0c5937db84f0');
    console.log('Attempting to get user media');
    localVideo = document.getElementById('localVideo');
    remoteVideo = document.getElementById('remoteVideo');


  function gotRemoteStream(streams) {
    // Call the polyfill wrapper to attach the media stream to this element.
    attachMediaStream(remoteVideo, streams);
    console.log('remoteStreamsAdded',streams);
  }

  function getMedia(onSuccess) {
    webrtc.usermedia.getUserMedia({
      mediaType: 'video',
      localMedia: localVideo,
      remoteMedia: remoteVideo,
      onUserMedia: onSuccess,
      onUserMediaError: function () {
      }
    });
  }
  
  function connect() {
    var ChatText = $("#ChatText").val();
    if ('' === ChatText) {
      throw new Error('Please enter the dial');
    }
    getMedia(function (media) {
      peerConnection = webrtc.getInstance({
        remoteSdp: remoteSdp,
        stream: media.localStream,
        mediaType: 'video',
        onSuccess: function () {
          $.ajax({
            type: 'POST',
            url:'connectUser.php',
            data:{
              from:username,
              to:ChatText,
              description: peerConnection.getLocalDescription()
            },
            success: function (){
              //$('#ChatMessages').load("DisplayMessage.php");
              $("#ChatText").val('');
            }
          });
          console.log(peerConnection.getLocalDescription());
        },
        onRemoteStream: gotRemoteStream,
        onError: function () {
        }
      });
    });
  }
  
  function receiveCall() {
    
    
    getMedia(function (media) {
      peerConnection = webrtc.getInstance({
        remoteSdp: remoteSdp,
        stream: media.localStream,
        mediaType: 'video',
        onSuccess: function (description) {
          $.ajax({
            type: 'POST',
            url:'connectUser.php',
            data:{
              from:username,
              to:peer,
              description:description
            },
            success: function (){
              //$('#ChatMessages').load("DisplayMessage.php");
              $("#ChatText").val('');
              $('.answerCall').toggle(false);
              pusher.disconnect();
            }
          });
          console.log(peerConnection.getLocalDescription());
        },
        onRemoteStream: gotRemoteStream,
        onError: function () {
        }
      });
    });
  }

  // create a channel with the username 
  username =  $('#username').text();
  var channel = pusher.subscribe(username);

  // event name can be session or call event 
  channel.bind('my-event', function(data) {
    var to;
    console.log('The data for a call',data);
    
    //from user
    to = data.to;
    peer = data.from;
    if (data.message.type === 'answer') {
       peerConnection.setRemoteDescription(data.message);
       pusher.disconnect();
    }
    
    if (data.message.type === 'offer') {
      remoteSdp = data.message;
      //enable the enable the receive Call button
      $('.answerCall').toggle(true);
      
    }

    $("#message").text(data.message)
  });


  pusher.connection.bind( 'error', function( err ) {
  if( err.data.code === 4004 ) {
    log('>>> detected limit error');
  }
});
  //}
//};

  $('#ChatText').keyup(function (e) {
    if(e.keyCode == 13) {
      var ChatText = $("#ChatText").val();

    }
  });


//setInterval(function(){
//  $('#ChatMessages').load("DisplayMessage.php");
//}, 1500);

//$('#ChatMessages').load("DisplayMessage.php");
