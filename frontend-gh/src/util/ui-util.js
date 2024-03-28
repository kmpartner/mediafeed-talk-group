
export const appInstallHandler = (deferredPrompt) => {
  // const deferredPrompt = this.deferredPrompt;
  console.log('in appInstallHandler', deferredPrompt);

  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice
      .then((choiceResult) => {
        console.log(choiceResult.outcome);
        if (choiceResult.outcome === 'dismissed') {
          console.log('user canceled install');

        } else {
          console.log('user added to home screen');

        }
      })
      .catch(err => {
        console.log(err);
      });
    // deferredPrompt = null;
  }
};