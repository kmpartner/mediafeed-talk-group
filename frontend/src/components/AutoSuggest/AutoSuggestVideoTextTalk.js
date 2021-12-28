// const React = window.React = require('react');
import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import { useTranslation } from 'react-i18next/hooks';
import _ from 'lodash';
import Img from "react-cool-img";

import Button from '../Button/Button';
import input from '../Form/Input/Input';
import { BASE_URL } from '../../App';

import SampleImage from '../Image/person-icon-50.jpg';

var theme = {
  container: {
    // position: 'relative'
  },
  input: {
    width: 240,
    width: '100%',
    height: 30,
    padding: '10px 20px',
    fontFamily: 'Helvetica, sans-serif',
    // fontWeight: 300,
    // fontSize: 1rem,
    border: '1px solid #aaa',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  inputFocused: {
    outline: 'none'
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },

  suggestionsContainer: {
    // display: 'none'
  },
  containerOpen: {
    suggestionsContainer: {
      // display: 'block'
    }
  },

  suggestionsContainer: {
    // display: 'none'
  },
  suggestionsContainerOpen: {
    display: 'block',
    position: 'absolute',
    // top: 51,
    // width: 280,
    width: '100%',
    height: '70%',
    // height: '90%',
    overflowY: 'auto',
    border: '0.25px solid #aaa',
    backgroundColor: '#fff',
    backgroundColor: 'var(--background-color)',
    backgroundColor: 'var(--textTalk-textContainerBackground)',
    fontFamily: 'Helvetica, sans-serif',
    // fontWeight: 300,
    // fontSize: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 2,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.26)'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestion: {
    cursor: 'pointer',
    padding: '10px 20px'
  },
  suggestionHighlighted: {
    // backgroundColor: '#ddd'
  }

};

const AutoSuggestVideoTextTalk = (props) => {
  // console.log('AutoSuggestUser-props', props);
  const [t] = useTranslation('translation');

  if (localStorage.getItem('darkMode') === 'true') {
    theme.input.background = 'rgb(53, 53, 53)';
    theme.input.color = 'rgb(190, 190, 190)';
    // theme.suggestionsContainerOpen.backgroundColor = 'rgb(53, 53, 53)'
  } else {
    theme.input.background = 'white';
    theme.input.color = '#333';
    // theme.suggestionsContainerOpen.backgroundColor = '#fff'
  }

  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const selectedNameFromGroup = queryParams.get('grouptotalk');

  // Autosuggest is a controlled component.
  // This means that you need to provide an input value
  // and an onChange handler that updates this value (see below).
  // Suggestions also need to be provided to the Autosuggest,
  // and they are initially empty because the Autosuggest is closed.
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (selectedNameFromGroup) {
      setValue(selectedNameFromGroup);
    }
  },[]);

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    // let nameContain = _.filter(props.userList, function (user) {
    //   if (inputValue) {
    //     return user.name.indexOf(inputValue) > -1;
    //   }
    //   return [];
    // });

    let nameContain = [];

    if (inputLength < 3) {
      nameContain = props.userList.filter(user => {
        return user.name.toLowerCase() === inputValue;
      });
    }

    if (inputLength === 3) {
      nameContain = props.userList.filter(user => {
        return user.name.toLowerCase().startsWith(inputValue);
      });
    }

    if (inputLength >= 4) {
      nameContain = _.filter(props.userList, function(user) {
        if (inputValue) {
          // console.log(inputValue, group.groupName.indexOf(inputValue))
          return user.name.toLowerCase().indexOf(inputValue) > -1;
        }
        return [];
      });
    }

    console.log(nameContain);

    // const returnList = inputLength < 2 ? [] : nameContain;

    props.getSuggestList(nameContain);

    return nameContain;

    // return inputLength === 0 ? [] : props.userList.filter(user =>
    //   user.name.toLowerCase().slice(0, inputLength) === inputValue
    // );
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = suggestion => {
    console.log(suggestion);
    // props.setSearchSelectedUser(suggestion);
    return suggestion.name
  };

  // Use your imagination to render suggestions.
  const renderSuggestion = suggestion => (
    <div className="AutoSuggest__Element">
      <span className="AutoSuggest__ImageContainer">

        {suggestion.imageUrl ?
          // <img className="AutoSuggest__ImageElement"
          //   src={suggestion.imageUrl} alt=''
          // ></img>
          <Img className="AutoSuggest__ImageElement"
          src={suggestion.imageUrl} alt='user-img'
          />
          :
          // <img className="AutoSuggest__ImageElement"
          //   src={SampleImage} alt=''
          // ></img>
          <Img className="AutoSuggest__ImageElement"
          src={SampleImage} alt='user-img'
          />
        }

      </span>
      <span className="AutoSuggest__nameElement">
        {suggestion.name}
      </span>
      {props.listType === 'listForSuggest' ?
        <span>
          {/* <Button design='' mode='raised' size='smaller'
          onClick={() => {
            // console.log(suggestion);
            props.callUser(suggestion.socketId);
            setValue('');
          }}
        >
          start talk
        </Button> */}
          {props.startTalkButton}
        </span>
        :
        <span>
          <Button design='' mode='raised' size='smaller'
            onClick={() => {
              // console.log(suggestion);
              // props.noconnectGetUserDestTalkHandler(suggestion._id);
              // props.showNoconnectTextTalkHandler();
              // props.noconnectDestUserIdHandler(suggestion._id);
              // setValue('');

              props.noconnectGetUserDestTalkHandler(suggestion.userId);
              props.showNoconnectTextTalkHandler();
              props.noconnectDestUserIdHandler(suggestion.userId);
              setValue('');
            }}
          >
            write text
        </Button>
        </span>
      }
    </div>
  );

  const onChange = (event, { newValue }) => {
    setValue(newValue);

    // props.isSuggestInput(newValue);
    // console.log(props.isSuggestInput(newValue));

    // if (newValue.length === 0) {
    //   // props.setSearchSelectedUser(null);
    // }

  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);

  };
  // const { value, suggestions } = this.state;

  const shouldRenderSuggestions = (value, reason) => {
    // return value.trim().length > 2;
    return true;
  }

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    // placeholder: `${props.listType === 'listForSuggest' ? 'search online user' : 'search user'}`,
    placeholder: `${props.listType === 'listForSuggest' ? `${t('videoTalk.text15')}` : `${t('videoTalk.text16')}`}`,
    value,
    onChange: onChange,
    // shouldRenderSuggestions: shouldRenderSuggestions
    // autoFocus: true
  };

  // Finally, render it!
  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      theme={theme}
    />
  );

}

export default AutoSuggestVideoTextTalk;
