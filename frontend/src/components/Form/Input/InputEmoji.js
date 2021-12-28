import React from 'react';
import { useState, useEffect } from 'react';

import TransBackdrop from '../../Backdrop/TransBackdrop';
import { patienceDiff, setCaretPosition } from '../../../util/style';

import './InputEmoji.css';


import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

// let a = "thelebronnjamist";
// let b = "the lebron james";

// let a = "abcde";
// let b = "abde";

// let difference = patienceDiff( a.split(""), b.split("") );
// console.log('difference', difference);

const inputEmoji = props => {

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputEmoji, setInputEmoji] = useState('');
  const [diffIndex, setDiffIndex] = useState('');
  const [inputPosition, setInputPosition] = useState(0);

  useEffect(() => {
    if (props.previousContentInput) {
      setInputEmoji(props.previousContentInput);
    }
  }, []);

  useEffect(() => {
    props.getInput(inputEmoji);
    // console.log('inputEmoji', inputEmoji, props);

    // setCaretPosition('inputEmoji', 2);

    // const inputEl = document.getElementsByTagName('textarea');
    // const pos = position(inputEl[0]);
    // console.log('input pos', pos);
  }, [inputEmoji]);

  useEffect(() => {
    const inputEl = document.getElementsByTagName('textarea');
    console.log('input', inputEl.selectionStart);
    console.log('inputEl', inputEl);
    if (inputEl.length > 0) {
      inputEl[0].addEventListener("keyup", function () {
        console.log("input Caret position: " + this.selectionStart);

        // console.log('input selectionStart', inputEl[0].selectionStart);
        setInputPosition(this.selectionStart);
        // You can also set the caret: this.selectionStart = 2;
      });

      inputEl[0].addEventListener("click", function () {
        console.log("input click Caret position: " + this.selectionStart);

        // console.log('input selectionStart', inputEl[0].selectionStart);
        setInputPosition(this.selectionStart);
        // You can also set the caret: this.selectionStart = 2;
      });
    }
  },[]);

  // useEffect(() => {
  //   console.log(props, props.contentChangeNum);
  //   if(diffIndex) {
  //     setCaretPosition('textareaEmoji', diffIndex);
  //   }
  // },[props.contentChangeNum]);

  const onEmojiClick = (event, emojiObject) => {
    // console.log(emojiObject);
    setChosenEmoji(emojiObject);
    // setInputEmoji(inputEmoji + emojiObject.emoji);
    console.log('inputEmoji, inputPosition', inputEmoji, inputPosition);
    let preText = '';
    let postText = '';
    if (inputEmoji.length > 0) {
      preText = inputEmoji.slice(0, inputPosition);
      postText = inputEmoji.slice(inputPosition);

      console.log('inputEmoji', inputEmoji, 'preText:', preText, 'postText:', postText, inputEmoji.length, inputPosition);
      // console.log('input substring', inputEmoji.substring(0, inputPosition -1), inputEmoji.substring(inputPosition -1))
    }

    // setInputEmoji(inputEmoji + emojiObject.native);
    
      const afterCombinedText = preText + emojiObject.native + postText;
      
      // if (!postText) {
      //   setInputPosition(afterCombinedText.length);
      // } else {
      //   setInputPosition((preText + emojiObject.native).length);
      // }

      setInputPosition((preText + emojiObject.native).length);
      
      setInputEmoji(afterCombinedText);
  };

  const showEmojiPickerHandler = () => {
    setShowEmojiPicker(!showEmojiPicker);

    //// setInputEmoji when emojiPicker open (when draft is exist set draft value)
    if (!showEmojiPicker) {
      setInputEmoji(props.value);
    }
  };

  const emojiInputHandler = (event) => {
    console.log('inputEmoji', inputEmoji, event.target.value, event.target);

    const difference = patienceDiff(inputEmoji.split(""), event.target.value.split(""));
    console.log('diff', difference);
    const differentIndex = difference.lines.findIndex(element => {
      return element.aIndex === -1 || element.bIndex === -1;
    });
    console.log(difference.lines[differentIndex]);
    console.log('diffIndex', differentIndex);
    if (difference.lines[differentIndex]) {

      if (difference.lines[differentIndex].aIndex === -1) {
        setDiffIndex(differentIndex + 1);
        // setDiffIndex(difference.lines[differentIndex].bIndex + 1)
      } 
      if (difference.lines[differentIndex].bIndex === -1) {
        setDiffIndex(differentIndex);
        // setDiffIndex(difference.lines[differentIndex].aIndex)
      }
    }
    // setCaretPosition('inputEmoji', differentIndex);
    setInputEmoji(event.target.value);
  };

  // console.log('chosenEmoji',chosenEmoji);

  return (
    <div>
      {/* <div>{inputEmoji}</div> */}
    <div className="inputEmoji">
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      {props.control === 'input' && (
        <div className="">
          <input
            className={[
              // 'inputEmoji__input',
              !props.valid ? 'invalid' : 'valid',
              props.touched ? 'touched' : 'untouched'
            ].join(' ')}
            type={props.type}
            id={props.id}
            required={props.required}
            // value={props.value}
            value={props.value}
            placeholder={props.placeholder}
            onChange={e => {
              // console.log(props.id, e.target.value, e.target.files);
              props.onChange(props.id, e.target.value, e.target.files);
              emojiInputHandler(e);
            }}
            onBlur={props.onBlur}
          />
          <div className="inputEmoji__emojiButton"
            onClick={showEmojiPickerHandler}
          > 😀 </div>
        </div>
      )}
      {props.control === 'textarea' && (
        <div className="inputEmoji__textareaContainer"
          onClick={showEmojiPicker && showEmojiPickerHandler}
        >
          <div className="inputEmoji__textareaButton" onClick={showEmojiPickerHandler}> 😀 </div>
          <textarea
            className={[
              // 'inputEmoji__input',
              !props.valid ? 'invalid' : 'valid',
              props.touched ? 'touched' : 'untouched'
            ].join(' ')}
            type={props.type}
            // id={props.id}
            id='textareaEmoji'
            required={props.required}
            // value={props.value}
            value={props.value}
            rows={props.rows}
            placeholder={props.placeholder}
            onChange={e => {
              // console.log(props.id, e.target.value, e.target.files);
              props.onChange(props.id, e.target.value, e.target.files);
              emojiInputHandler(e);
            }}
            onBlur={props.onBlur}
          />
        </div>
      )}
    </div>
    

    {showEmojiPicker ? 
        (
        // <Picker 
        //   emojiUrl="https://cdn.jsdelivr.net/npm/emoji-datasource-apple@6.0.1/img/apple/64"

        //   onEmojiClick={onEmojiClick} 
        //   preload={true}
        // />
        <div>
          {/* <TransBackdrop 
            backdropClassName='transbackdropEmoji'
            onClick={showEmojiPickerHandler} 
          /> */}
          <Picker 
            set='apple' 
            // style={{ position: '', top: '', bottom:'', left: '0px', zIndex: '300', maxHeight:'90vh', maxWidth:'60%', overflow:'auto'}}
            style={props.pickerStyle 
              ? props.pickerStyle 
              : { position: '', top: '', bottom:'', left: '0px', zIndex: '300', maxHeight:'90vh', maxWidth:'90%', overflow:'auto'}}
            title='Pick emoji…' 
            skin={1}
            showSkinTones='false'
            emoji='point_up'
            skinEmoji='false'
            perLine='7'
            sheetSize='20'
            showPreview='false'
            // onClick={(emoji, event) => {onEmojiClick(event, emoji)}}
            // onClick={(emoji, event) => {console.log(emoji, event)}}
            onSelect={(emoji) => {
              onEmojiClick('', emoji);
              // showEmojiPickerHandler();
            }}
          />
        </div>
        )
      : null
    }
    </div>
  );
}


export default inputEmoji;
