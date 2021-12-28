import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next/hooks';

import Button from '../Button/Button';
import Loader from '../Loader/Loader';
import './Modal.css';

const modal = props => {
  // console.log('Modal.js-Props', props);
  const [t] = useTranslation('translation');

  return ReactDOM.createPortal(
    <div className={[
      'modal',
      `modal--${props.modalType}`,
      // `modal--${props.mode}`,
      // `modal--${props.size}`
      ].join(' ')}
    >
      <header className="modal__header">
        {/* <h1>{props.title}</h1> */}
      </header>
      <div className="modal__content">{props.children}</div>

      {props.isLoading ? 
          <div className="modal__loader">
            <Loader /> 
          </div>
      : null
      }
      
      <div className="modal__actions">
        <Button design="danger" mode="flat" 
          onClick={props.onCancelModal}
          loading={props.isLoading}
        >
          {/* Cancel */}
          {t('general.text1')}
        </Button>

      {props.modalType === 'error' ? 
        null 
        :
          <Button
            mode="raised"
            onClick={props.onAcceptModal}
            disabled={!props.acceptEnabled}
            loading={props.isLoading}
          >
            {/* Accept */}
            {t('general.text2')}
          </Button>
      }

      </div>
    </div>,
    document.getElementById('modal-root')
  );
}

export default modal;
