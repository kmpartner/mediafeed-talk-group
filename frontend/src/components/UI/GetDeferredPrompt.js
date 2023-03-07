import React, { Fragment, useEffect } from "react";
// import { useDispatch } from "react-redux";

// import { useRedux } from "hooks/useRedux";
// import { fetchAccountAction } from "ducks/account";

import { useStore } from "../../hook-store/store";
// import { fetchNetworkFee } from '../../../utils/nft/offer-util';

function GetDefferredPrompt() {

    const [store, dispatch] = useStore();

    
    useEffect(() => {
      console.log('installpromprt');
      window.addEventListener('beforeinstallprompt', (event) => {
        console.log('beforeinstallprompt fired installhandler headermodal');
        event.preventDefault();
        // deferredPrompt = event;
        console.log('in beforeinstallprompt', event);
        // addBtn.style.display = 'block';

        dispatch('SET_DEFERREDPROMPT', event);
        // setInstallStyle('block');
  
      });
    },[]);

    return (
        <Fragment>
        </Fragment>
    );
}

export default GetDefferredPrompt;