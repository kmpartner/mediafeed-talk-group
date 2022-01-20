import React from 'react';
import { useEffect } from 'react';

import { useStore } from '../../hook-store/store';

import './Paginator.css';

const paginator = props => {
  console.log('paginator.js-props',props, props.currentPage, props.lastPage);

  const [store, dispatch] = useStore();
  console.log('store in paginator.js', store);

  useEffect(() => {
    //// set store viewPage same as props.currentPage
    if (props.currentPage > 1) {
      dispatch('SET_VIEW_PAGE', props.currentPage);
    }

    //// (back to feed from single post case) 
    //// if props.currentPage is 1 and viewPage is greater than 1, set currentPage state in feed view page to view page
    if (props.currentPage === 1 && store.viewPage >= 2) {
      props.getStoreCurrentPage(store.viewPage);
    }

  },[props.currentPage]);

  let pageNumber;
  if (props.currentPage > 1 && props.currentPage < props.lastPage) {
    pageNumber = props.currentPage;
  }

  const previousHandler = () => {
      //// when back to page 1, set store viewPage 1
      if (store.viewPage === 2) {
        dispatch('SET_VIEW_PAGE', props.currentPage - 1);
      }
      
      props.onPrevious();
  }

  // const nextHandler = () => {
  //   props.onNext();
  // }
 
  return (
    <div className="paginator">
      {props.children}
      <div className="paginator__controls">
        {props.currentPage > 1 && (
          <button className="paginator__control" 
            // onClick={props.onPrevious}
            onClick={previousHandler}
          >
            Previous
          </button>
        )}
       
        <span>{pageNumber}</span>
  
        {props.currentPage < props.lastPage && (
          <button className="paginator__control" 
            onClick={props.onNext}
            // onClick={nextHandler}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default paginator;
