// const React = window.React = require('react');
import React, { useState } from 'react'; 
import Autosuggest from 'react-autosuggest';
import { useTranslation } from 'react-i18next/hooks';
import _ from 'lodash';

import { BASE_URL } from '../../App';
import './AutoSuggestHook.css';

var theme = {
  container: {
    // position: 'relative'
  },
  input: {
    width: 240,
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
    display: 'none'
  },
  // suggestionsContainerOpen: {
  //   display: 'block',
  //   position: 'absolute',
  //   // top: 51,
  //   // width: 280,
  //   border: '1px solid #aaa',
  //   backgroundColor: '#fff',
  //   fontFamily: 'Helvetica, sans-serif',
  //   // fontWeight: 300,
  //   // fontSize: 16,
  //   borderBottomLeftRadius: 4,
  //   borderBottomRightRadius: 4,
  //   zIndex: 2
  // },
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
    backgroundColor: '#ddd'
  }

};

// const menuStyle = {
//     borderRadius: '3px',
//     boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
//     background: 'rgba(255, 255, 255, 0.9)',
//     padding: '2px 0',
//     fontSize: '90%',
//     position: 'fixed',
//     overflow: 'auto',
//     maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
//     zIndex: '0'
//   }

const AutosuggestHook = (props) => {
    console.log('AutoSuggestHook-props', props);
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
    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
 
    // Teach Autosuggest how to calculate suggestions for any given input value.
    const getSuggestions = value => {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;
    
      let titleNameContain = _.filter(props.posts, function(post) {
        if (inputValue && inputValue.length <= 2) {
          return post.title === inputValue;
        }
        
        if (inputValue && inputValue.length > 2) {
          return (post.title.indexOf(inputValue) > -1);
        }
        return [];
        // return indexOfWord(post.title) > -1;
      });
      console.log(titleNameContain);

      // const nameMatch = _.filter(props.posts, function(post) {
      //   if (inputValue) {
      //     return post.creatorName.toLowerCase().slice(0, inputLength) === inputValue;
      //   }
      //   return null;
      // });
      // console.log(nameMatch);


      if (titleNameContain.length > props.maxSearchPostNumber) {
        titleNameContain = titleNameContain.slice(0, props.maxSearchPostNumber);
      }

      props.getSearchPosts(titleNameContain);
      return inputLength === 0 ? [] : titleNameContain;
      return inputLength === 0 ? [] : props.posts.filter(post => {
        return post.title.toLowerCase().slice(0, inputLength) === inputValue ||
          post.creatorName.toLowerCase().slice(0, inputLength) === inputValue
      }
      );
    };

    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion. Teach Autosuggest how to calculate the
    // input value for every given suggestion.
    const getSuggestionValue = suggestion => {
      return suggestion.title;
    }
    
    // Use your imagination to render suggestions.
    const renderSuggestion = suggestion => {
      return (
      <div className="AutoSuggest__Element">
        <span className="AutoSuggest__ImageContainer">
          {/* <img className="AutoSuggest__ImageElement" src={BASE_URL + `/${suggestion.modifiedImageUrl}`} height="25" alt=""/> */}
        </span>
        <span>
          <span style={{fontWeight:"bolder"}}>{suggestion.title}</span>
          <br /> 
          {suggestion.creatorName}
        </span>
      </div>
    );
      }

    const onChange = (event, { newValue }) => {
      setValue(newValue);
      console.log(newValue);
      if (newValue) {
        props.resetSearchPostPage();
      }
      if (newValue.length === 0) {
        props.getSearchPosts([]);
        props.resetSearchPostPage();
      }
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
 
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      // placeholder: 'Type for search...',
      placeholder: `${t('feed.text23')}`,
      value,
      onChange: onChange
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
        // menuStyle={menuStyle}
      />
    );
  
}

export default AutosuggestHook;
