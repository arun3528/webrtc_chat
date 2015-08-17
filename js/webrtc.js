/*jslint browser: true, devel: true, node: true, debug: true, todo: true, indent: 2, maxlen: 150 */
/*global ATT, RTCPeerConnection, RTCSessionDescription*/
(function () {
  'use strict';
  function createPeerConnection(config) {
    console.log('createPeerConnection.config', config);

    var pc,
      onRemoteStream,
      onICECandidatesCompleted,
      pcConfig,
      pc_constraints

    if (undefined === config || Object.keys(config).length === 0) {
      console.error('No options passed.');
      throw new Error('No options passed.');
    }
   
    if (undefined === config.stream) {
      console.error('No `stream` passed.');
      throw new Error('No `stream` passed.');
    }
    
    if (undefined === config.mediaType) {
      console.error('No `mediaType` passed.');
      throw new Error('No `mediaType` passed.');
    }
    
    if ('function' !== typeof config.onSuccess) {
      console.error('No `onSuccess` callback passed.');
      throw new Error('No `onSuccess` callback passed.');
    }

    onICECandidatesCompleted = config.onSuccess;

    if ('function' !== typeof config.onRemoteStream) {
      console.error('No `onRemoteStream` callback passed.');
      throw new Error('No `onRemoteStream` callback passed.');
    }
    onRemoteStream = config.onRemoteStream;

    if ('function' !== typeof config.onError) {
      console.error('No `onError` callback passed.');
      throw new Error('No `onError` callback passed.');
    }

//    if ('object' !== typeof config.pcConfiguration) {
//      console.error('No `pcConfiguration` parameter passed.');
//      throw new Error('No `pcConfiguration` parameter passed.');
//    }

    function jsonDescription(rtcSessionDescription) {
      return {
        sdp: rtcSessionDescription.sdp,   // Not returning the RTCSessionDescription object
        type: rtcSessionDescription.type  // since it is not a valid JSON
      };
    }

    function removeStream(stream) {

      if (undefined === stream || null === stream) {
        throw new Error("Stream is undefined");
      }

      console.trace('peerConnection: Removing stream');
      console.log('stream.id', stream.id);

      pc.removeStream(stream);
    }

    function addStream(stream) {

      if (undefined === stream || null === stream) {
        throw new Error("Stream is undefined");
      }

      console.trace('peerConnection: Adding stream');
      console.log('stream.id', stream.id);

      pc.addStream(stream);
      
    }

    function setLocalDescription(description, onSuccess, onError) {
      console.trace('peerConnection: setLocalDescription');
      console.log('description.type', description.type);
      console.log('description.sdp', description.sdp);


      pc.setLocalDescription(new RTCSessionDescription(description), function () {
        console.trace('Successfully set the local description.');

        if (undefined !== onSuccess && 'function' === typeof onSuccess) {
          onSuccess();
        }
      }, function (error) {
        console.error('Error setting the local description.');
        console.log('error', error);

        if (undefined !== onError && 'function' === typeof onError) {
          onError(error);
        }
      });
    }

    function setRemoteDescription(description, onSuccess, onError) {
      console.trace('peerConnection: setRemoteDescription');
      console.log('description.type', description.type);
      console.log('description.sdp', description.sdp);

      pc.setRemoteDescription(new RTCSessionDescription(description), function () {
        console.trace('Successfully set remote description.');

        if (undefined !== onSuccess && 'function' === typeof onSuccess) {
          onSuccess();
        }
      }, function (err) {
        console.error('Failed to set remote description.');
        console.log('error', err);
        if (undefined !== onError && 'function' === typeof onError) {
          onError(err);
        }
      });
    }

    function createOffer(success, error, constraints) {
      console.trace('peerConnection: createOffer');
      console.log('constraints', constraints);

      if (success === undefined) {
        throw new Error('No success callback defined.');
      }
      if (error === undefined) {
        throw new Error('No error callback defined.');
      }
      pc.createOffer(success, error, {
        mandatory: constraints
      });
    }

    function createAnswer(success, error, constraints) {
      console.trace('peerConnection: createAnswer');
      console.log('constraints', constraints);

      if (success === undefined) {
        throw new Error('No success callback defined.');
      }
      if (error === undefined) {
        throw new Error('No error callback defined.');
      }
      pc.createAnswer(success, error, {
        mandatory: constraints
      });
    }

    function createSdpOffer(options) {
      console.log('createSdpOffer: options', options);
      console.info('Trying to create an SDP offer...');

      pc.createOffer(function (description) {
        console.trace('createOffer: success');
        console.info('Successfully created the sdp offer');
        console.log('local description', description);

        setLocalDescription(description, function () {
          console.trace('createOffer:setLocalDescription: success');
          console.info('Successfully set the local description during createSdpOffer');

          if (undefined !== options.onSuccess) {
            options.onSuccess();
          }
        }, function (error) {
          console.trace('createSdpOffer:setLocalDescription: error');
          console.error('Error during createSdpOffer:setLocalDescription');
          console.log(error);

          options.onError(error);
        });
      }, function (error) { // ERROR createSdpOffer
        console.error('Error during createSdpOffer');
        console.log(error);

        options.onError(error);
      }, {
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: (config.mediaType === 'video')
        }
      });
    }

    function generateOffer(offerOptions) {
      if (undefined === offerOptions) {
        throw new Error('No options provided.');
      }
      if (undefined === offerOptions.constraints) {
        throw new Error('No constraints provided.');
      }

      if (undefined === offerOptions.onOfferReady) {
        throw new Error("No onOfferReady callback provided.");
      }
      if (undefined === offerOptions.onError) {
        throw new Error('No onError callback provided.');
      }

      console.info('Trying to generate an SDP offer...');

      createOffer(function (description) {
        console.trace('createOffer: success');
        console.info('Successfully created the sdp offer during generateOffer');

        if ('function' === typeof offerOptions.onOfferCreated) {
          description = offerOptions.onOfferCreated(jsonDescription(description));
        }

        console.log('local description', description);
        console.info('Trying to set the local description...');

        setLocalDescription(description, function () {
          console.trace('createOffer:setLocalDescription: success');
          console.info('Successfully set the local description during generateOffer');

          if (pc.iceGatheringState === 'complete') {
            offerOptions.onOfferReady(jsonDescription(description));
          } else {
            onICECandidatesCompleted = offerOptions.onOfferReady;
          }

        }, function (error) {
          console.trace('generateOffer:setLocalDescription: error');
          console.error('Error during generateOffer:setLocalDescription');
          console.log(error);

          offerOptions.onError(error);
        });

      }, function (error) {
        console.trace('generateOffer:setLocalDescription: error');
        console.error('Error during generateOffer:createOffer');
        console.log(error);

        offerOptions.onError(error);
      }, offerOptions.constraints);
    }

    function createSdpAnswer(options) {
      console.log('createSdpAnswer: options', options);
      console.info('Trying to create an SDP answer...');

      pc.createAnswer(function (description) {
        console.trace('createAnswer: success');
        console.info('Successfully created the SDP answer');
        console.log('localSdp', description);

        setLocalDescription(description, function () {
          console.trace('createSdpAnswer:setLocalDescription: success');
          console.info('Successfully set the local description during createSdpAnswer');

          if (undefined !== options.onSuccess) {
            options.onSuccess(description);
          }
        }, function (error) {
          console.trace('createSdpAnswer:setLocalDescription: error');
          console.error('Error during createSdpAnswer:setLocalDescription');
          console.log(error);

          options.onError(error);
        });
      }, function (error) {// ERROR createAnswer
        console.trace('createAnswer: error');
        console.info('Error creating the SDP answer');
        console.log(error);

        options.onError(error);
      }, {
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: (config.mediaType === 'video')
        }
      });
    }

    function acceptSdpOffer(options) {
      console.log('acceptSdpOffer: options', options);
      console.info('Trying to set the remote description...');

      setRemoteDescription(options.remoteDescription, function () {
        console.trace('acceptSdpOffer:setRemoteDescription: success');
        console.info('Trying to create the SDP answer...');

        createSdpAnswer(options);
      }, function (error) {
        console.trace('acceptSdpOffer:setRemoteDescription: error');
        console.info('Error during acceptSdpOffer:setRemoteDescription');
        console.log(error);

        options.onError(error);
      });
    }

    function generateAnswer(answerOptions) {

      if (undefined === answerOptions) {
        throw new Error('No options provided.');
      }

      if (undefined === answerOptions.constraints) {
        throw new Error('No constraints provided.');
      }

      if ('function' !== typeof (answerOptions.onAnswerReady)) {
        throw new Error('No onAnswerReady callback provided.');
      }

      if ('function' !== typeof (answerOptions.onError)) {
        throw new Error('No onError callback provided.');
      }

      console.info('Trying to generate an SDP answer...');

      createAnswer(function (description) {

        console.trace('createAnswer: success');
        console.info('Successfully created the sdp offer during generateAnswer');

        console.log('description on createAnswer success', description);

        if ('function' === typeof (answerOptions.onAnswerCreated)) {
          description = answerOptions.onAnswerCreated(jsonDescription(description));
        }

        setLocalDescription(description, function () {

          console.trace('createAnswer:setLocalDescription: success');
          console.info('Successfully set the local description during generateAnswer');

          if (pc.iceGatheringState === 'complete') {
            answerOptions.onAnswerReady(jsonDescription(description));
          } else {
            onICECandidatesCompleted = answerOptions.onAnswerReady;
          }

        }, function (error) {
          console.trace('generateAnswer:setLocalDescription: error');
          console.error('Error during generateAnswer:setLocalDescription');
          console.log(error);

          answerOptions.onError(error);
        });

      }, function (error) {
        console.trace('generateAnswer:createAnswer: error');
        console.error('Error during generateOffer:createAnswer');
        console.log(error);

        answerOptions.onError(error);
      }, answerOptions.constraints);
    }


    try {
      console.info('Creating the peer connection');

      pcConfig = {
        iceServers: [
                     { 'url': 'STUN:stun.l.google.com:19302' },
                     { 'url': 'STUN:stun1.l.google.com:19302' },
                     { 'url': 'STUN:stun2.l.google.com:19302' }
                   ],
        iceTransports: 'all'
      };

      pc_constraints = {
        optional: [
          {
            googIPv6: false
          }
        ]
      };

      pc = new RTCPeerConnection(pcConfig, pc_constraints);
    } catch (error) {
      console.error('Failed to create PeerConnection.');
      console.log(error);

      throw new Error('Failed to create PeerConnection.');
    }

    pc.addStream(config.stream);

    pc.onaddstream = function (event) {
      onRemoteStream(event.stream);
    };

    pc.onicecandidate = function (event) {

      console.trace('createPeerConnection: onIceCandidate');
      console.info('Got ICE candidate');
      console.log('candidate', event.candidate);

      if (event.candidate) {
        console.info('Got new ICE Candidate');
        console.log('Candidate', event.candidate);
      } else {
        console.info('End of ICE Candidates');
        onICECandidatesCompleted(jsonDescription(pc.localDescription));
      }
    };

    if (undefined === config.remoteSdp) {
      createSdpOffer({
        onError: config.onError
      });
    } else {
      acceptSdpOffer({
        remoteDescription: config.remoteSdp,
        onError: config.onError
      });
    }

    console.info('Peer connection created');
    console.log('Peer connection', pc);

    return {
      isStateStable: function () {
        return (pc.signalingState === 'stable');
      },
      hasLocalOffer: function () {
        return (pc.signalingState === 'have-local-offer');
      },
      hasRemoteOffer: function () {
        return (pc.signalingState === 'have-remote-offer');
      },
      getLocalDescription: function () {
        return jsonDescription(pc.localDescription);
      },
      setRemoteDescription: setRemoteDescription,
      setLocalDescription: setLocalDescription,
      createSdpOffer: createSdpOffer,
      createSdpAnswer: createSdpAnswer,
      acceptSdpOffer: acceptSdpOffer,
      getRemoteDescription: function () {
        return jsonDescription(pc.remoteDescription);
      },
      close: function () {
        pc.close();
        pc = null;
      },
      removeStream: removeStream,
      addStream: addStream,
      generateOffer: generateOffer,
      generateAnswer: generateAnswer,
      getUserMedia: getUserMedia
    };
  }
  
  var usermedia = {
		    localMedia: null,
		    remoteMedia: null,
		    localStream: null,
		    remoteStream: null,
		    mediaConstraints: null,
		    onUserMedia: null,
		    onMediaEstablished: null,
		    onUserMediaError: null,

		  
		    getUserMedia: function (options) {
		      console.info('Trying to get the user media');
		      console.trace(options);

		      var that = this;

		      this.localMedia = options.localMedia;
		      this.remoteMedia = options.remoteMedia;
          
          //if default mediaContraints needed
		      this.mediaConstraints = {video :true, audio : true};
		      this.onUserMedia = options.onUserMedia;
		      this.onUserMediaError = options.onUserMediaError;

		      if (undefined !== options.mediaType) {
		        this.mediaConstraints.video = 'audio' !== options.mediaType;
		      }

		      this.mediaConstraints.fake = (true === options.fake);

		      // get a local stream, show it in a self-view and add it to be sent
		      getUserMedia(this.mediaConstraints, that.getUserMediaSuccess.bind(that), options.onUserMedia);
		    },


		    getUserMediaSuccess: function (stream) {
		      console.info('getUserMedia: success');
		      console.info('Got the user media.');
		      console.trace('stream', stream);

		      // call the user media service to show stream
		      this.showStream({
		        localOrRemote: 'local',
		        stream: stream
		      });

		      // created user media object
		      var userMedia = {
		        mediaConstraints: this.mediaConstraints,
		        localStream: stream
		      };

		      this.onUserMedia(userMedia);
		    },

		    showStream: function (args) {
		      console.trace(args);

		      var videoStreamEl;

		      try {
		        if (args.localOrRemote === 'remote') {
		          this.remoteStream = args.stream;
		          videoStreamEl = this.remoteMedia;
		        } else {
		          this.localStream = args.stream;
		          videoStreamEl = this.localMedia;
		          videoStreamEl.setAttribute('muted', '');
		        }

		        if (videoStreamEl) {
		          videoStreamEl.src = window.URL.createObjectURL(args.stream);

		          console.info('About to play ' + args.localOrRemote + ' stream...');

		          videoStreamEl.play();
		          if (args.localOrRemote === 'remote') {
		            this.onMediaEstablished();
		          }
		        }
		      } catch (e) {
		        //get the sdk error
		        console.error('Error during showStream');
		        console.trace(e);
		        if (undefined !== this.onUserMediaError
		            && 'function' === typeof this.onUserMediaError) {
		          this.onUserMediaError(e);
		        }
		      }
		    },

		    stopUserMedia: function () {
		        try {
		        if (this.localStream) {
		          console.info('Stopping the local stream...');
		          this.localStream.stop();
		          this.localStream = null;
		          this.localMedia.src = '';
		        }
		        if (this.remoteStream
		            && 'function' === typeof this.remoteStream.stop) {
		          console.info('Stopping the remote stream...');
		          this.remoteStream.stop();
		          this.remoteStream = null;
		          this.remoteMedia.src = '';
		        }
		      } catch (e) {
		        console.error('Error stopping local and remote streams');

		        //todo get the sdk error
		        this.onUserMediaError(e);
		      }
		    }
		  };
  
  var webrtc = {
		    private: {
		    }
		  };
  

  window.webrtc  = (function () {
	    var instance;

	    return {
	      getInstance: function (options) {
	        if (undefined === instance) {
	          instance = new createPeerConnection(options);
	        }
	        return instance;
	      },
        usermedia : usermedia
	    };
	  }());
}());