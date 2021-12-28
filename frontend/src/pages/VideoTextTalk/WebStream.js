import React from 'react';

import './VideoTextTalk.css';

class WebcamStream extends React.Component {
  constructor(props) {
      super(props);
      this.videoTag = React.createRef();
      this.state = {
        test: ''
      };
  }

  componentDidMount() {
      // getting access to webcam
    console.log('WebcamStream-props', this.props);



    // this.props.peerConnection.ontrack = function ({ streams: [stream] }) {
    //   console.log('stream peeronnection.ontrack', [stream]);
    //   const remoteVideo = document.getElementById("remote-video");
    //   console.log('remoteVideo', remoteVideo);
    //   console.log('localvido', document.getElementById("local-video"))
    //   if (remoteVideo) {
    //     remoteVideo.srcObject = stream;
    //   }

    // };



    if (this.props.videoType === 'local-video') {
      navigator.mediaDevices
          //  .getUserMedia({video: true, audio: true })
          //  .getUserMedia({video: true })
          .getUserMedia({video: false, audio: false })
           .then(stream => {
             console.log('stream in WebcamStream', stream);
             this.videoTag.current.srcObject = stream
  
             stream.getTracks().forEach(track => {
               console.log('track, stream in webcamSteram', track, stream);
  
               const con = this.props.peerConnection.addTrack(track, stream);
               console.log('peerConnection', this.props.peerConnection);
               console.log('con', con);
               return con;
               return this.props.peerConnection.addTrack(track, stream)
             });
           })
           .catch(console.log);
    }

  }


  render() {

      return (
        <div>
          <video 
            className={this.props.videoType}
            id={this.props.id}
            ref={this.videoTag}
            width={this.props.width}
            height={this.props.height}
            autoPlay
            muted={this.props.videoType === 'local-video' ? true : false}
            title={this.props.title}
          ></video>
        </div>
      );
  }
}

export default WebcamStream;