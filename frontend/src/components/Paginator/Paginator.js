import React from 'react';

import './Paginator.css';

const paginator = props => {
  // console.log(props.currentPage, props.lastPage);

  let pageNumber;
  if (props.currentPage > 1 && props.currentPage < props.lastPage) {
    pageNumber = props.currentPage;
  }

  return (
    <div className="paginator">
      {props.children}
      <div className="paginator__controls">
        {props.currentPage > 1 && (
          <button className="paginator__control" onClick={props.onPrevious}>
            Previous
          </button>
        )}
       
        <span>{pageNumber}</span>
  
        {props.currentPage < props.lastPage && (
          <button className="paginator__control" onClick={props.onNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default paginator;
