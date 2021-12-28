import React, { Component, Fragment, useState, useEffect } from "react";
import { withI18n } from "react-i18next";

// import TransBackdrop from '../../../components/Backdrop/TransBackdrop';
// import SmallModal from '../../../components/Modal/SmallModal';

// import Backdrop from "../../Backdrop/Backdrop";
// import Button from "../../Button/Button";
// import Modal from "../../Modal/Modal";
// import Input from "../../Form/Input/Input";
// import InputEmoji from "../../Form/Input/InputEmoji";
// import FilePicker from "../../Form/Input/FilePicker";
// import Loader from "../../Loader/Loader";
// import Image from '../../Image/Image';
// import { isVideoFile, isImageFile } from "../../../util/image";
// import "./FeedEdit.css";

const CanvasTouchDraw = (props) => {
  // console.log('SinglePostImages.js-props', props);

  // const { } = props;

  useEffect(() => {
    // detectSwipe('idtest');

    //// touch event
    //// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
    
    function startup() {

      var el = document.getElementById("canvas");
      // var el = document.getElementById("testid");
      el.addEventListener("touchstart", handleStart, false);
      el.addEventListener("touchend", handleEnd, false);
      el.addEventListener("touchcancel", handleCancel, false);
      el.addEventListener("touchmove", handleMove, false);
    }
    
    document.addEventListener("DOMContentLoaded", startup);
    
    var ongoingTouches = [];
    let touchStartX;
    let touchStartY;

    function handleStart(evt) {
      evt.preventDefault();
      console.log("touchstart.");
      var el = document.getElementById("canvas");
      var ctx = el.getContext("2d");
      var touches = evt.changedTouches;
    
      for (var i = 0; i < touches.length; i++) {
        console.log("touchstart:" + i + "...");
        ongoingTouches.push(copyTouch(touches[i]));
        var color = colorForTouch(touches[i]);
        ctx.beginPath();
        ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
        ctx.fillStyle = color;
        ctx.fill();
        console.log("touchstart:" + i + ".");


        touchStartX = touches[i].pageX;
        touchStartY = touches[i].pageY;
        console.log('touch start position', touches[i].pageX, touches[i].pageY)
      }
    }

    function handleMove(evt) {
      evt.preventDefault();
      var el = document.getElementById("canvas");
      var ctx = el.getContext("2d");
      var touches = evt.changedTouches;
    
      for (var i = 0; i < touches.length; i++) {
        var color = colorForTouch(touches[i]);
        var idx = ongoingTouchIndexById(touches[i].identifier);
    
        if (idx >= 0) {
          console.log("continuing touch "+idx);
          ctx.beginPath();
          console.log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
          ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
          console.log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
          ctx.lineTo(touches[i].pageX, touches[i].pageY);
          ctx.lineWidth = 4;
          ctx.strokeStyle = color;
          ctx.stroke();
    
          ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
          console.log(".");
        } else {
          console.log("can't figure out which touch to continue");
        }
      }
    }

    function handleEnd(evt) {
      evt.preventDefault();
      log("touchend");
      var el = document.getElementById("canvas");
      var ctx = el.getContext("2d");
      var touches = evt.changedTouches;
    
      for (var i = 0; i < touches.length; i++) {
        var color = colorForTouch(touches[i]);
        var idx = ongoingTouchIndexById(touches[i].identifier);
    
        if (idx >= 0) {
          ctx.lineWidth = 4;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
          ctx.lineTo(touches[i].pageX, touches[i].pageY);
          ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
          ongoingTouches.splice(idx, 1);  // remove it; we're done


          console.log('touch end position: ',touches[i].pageX, touches[i].pageY);
          if (touches[i].pageX > touchStartX) {
            console.log('moved right');
            console.log('swiped left');
          }
          if (touches[i].pageX < touchStartX) {
            console.log('moved left');
            console.log('swiped right');
          }
          touchStartX = null;
          touchStartY = null;

        } else {
          console.log("can't figure out which touch to end");
        }
      }
    }

    function handleCancel(evt) {
      evt.preventDefault();
      console.log("touchcancel.");
      var touches = evt.changedTouches;
    
      for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouches.splice(idx, 1);  // remove it; we're done
      }
    }

    function copyTouch({ identifier, pageX, pageY }) {
      return { identifier, pageX, pageY };
    }

    function colorForTouch(touch) {
      var r = touch.identifier % 16;
      var g = Math.floor(touch.identifier / 3) % 16;
      var b = Math.floor(touch.identifier / 7) % 16;
      r = r.toString(16); // make it a hex digit
      g = g.toString(16); // make it a hex digit
      b = b.toString(16); // make it a hex digit
      var color = "#" + r + g + b;
      console.log("color for touch with identifier " + touch.identifier + " = " + color);
      return color;
    }

    function ongoingTouchIndexById(idToFind) {
      for (var i = 0; i < ongoingTouches.length; i++) {
        var id = ongoingTouches[i].identifier;
    
        if (id == idToFind) {
          return i;
        }
      }
      return -1;    // not found
    }

    function log(msg) {
      var p = document.getElementById('log');
      p.innerHTML = msg + "\n" + p.innerHTML;
    }


  },[])
  // console.log(selectedImageIndex);





  





//https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
const detectSwipe = (elementId) => {
  console.log('in detectSwipe');
  const ts = document.addEventListener('touchstart', handleTouchStart, false);        
  document.addEventListener('touchmove', handleTouchMove, false);
  console.log(ts);
  var xDown = null;                                                        
  var yDown = null;
  
  function getTouches(evt) {
    return evt.touches ||             // browser API
           evt.originalEvent.touches; // jQuery
  }                                                     
                                                                           
  function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    console.log('firstTouch', firstTouch);
      xDown = firstTouch.clientX;                                      
      yDown = firstTouch.clientY;                                      
  };                                                
                                                                           
  function handleTouchMove(evt) {
      if ( ! xDown || ! yDown ) {
          return;
      }
  
      var xUp = evt.touches[0].clientX;                                    
      var yUp = evt.touches[0].clientY;
  
      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;
                                                                           
      if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
          if ( xDiff > 0 ) {
              /* right swipe */ 
          } else {
              /* left swipe */
          }                       
      } else {
          if ( yDiff > 0 ) {
              /* down swipe */ 
          } else { 
              /* up swipe */
          }                                                                 
      }
      /* reset values */
      xDown = null;
      yDown = null;                                             
  };
}




  return <Fragment>

<canvas id="canvas" width="600" height="300" 
// style="border:solid black 1px;"
>
  Your browser does not support canvas element.
</canvas>
<br/>
Log: <pre id="log" 
// style="border: 1px solid #ccc;"
></pre>

    </Fragment>;
};

export default withI18n()(CanvasTouchDraw);
// export default FeedEdit;
