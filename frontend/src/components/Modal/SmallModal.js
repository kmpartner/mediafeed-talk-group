import React from 'react';
import ReactDOM from 'react-dom';

// import Button from '../Button/Button';
import Loader from '../Loader/Loader';
import './Modal.css';

const SmallModal = props => {
  // console.log('Modal.js-Props', props);
  return ReactDOM.createPortal(
    <div className={props.style}>
      {/* <header className="modal__header"> */}
        {/* <h1>{props.title}</h1> */}
      {/* </header> */}
      <div className={props.style === 'fullImageModal' ? '' : "modal__content"}>
        {props.children}
      </div>

      {props.isLoading ?
        <div className="modal__loader">
          <Loader />
        </div>
        : null
      }

      {/* <div className="modal__actions">
        <Button design="danger" mode="flat" onClick={props.onCancelModal}>
          Cancel
        </Button>
        <Button
          mode="raised"
          onClick={props.onAcceptModal}
          disabled={!props.acceptEnabled}
          loading={props.isLoading}
        >
          Accept
        </Button>
      </div> */}
    </div>,
    document.getElementById('modal-root')
  );
}

export default SmallModal;
