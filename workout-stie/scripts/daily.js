import { Utils as myUtils } from './utils.js';
import { TopNav } from './navigation.js';
import { PrivateInfoController as PrivateInfoWindow } from './privateInfo/PrivateInfoController.js';

/* Check if user updated their's nickcname and gender or not*/
const user = myUtils.getUser();

if (
  user.hasOwnProperty('nickname') === false ||
  user.hasOwnProperty('gender') === false
) {
  import('./modal/modal.js').then((module) => {
    const additionalModal = new module.AdditionalModalController();
    additionalModal.showModal();
  });
}

/* UI components */
const topNav = new TopNav();
let privateInfoWindow = null;

topNav.bindDropDownItemReadPrivate( () => {
  privateInfoWindow = new PrivateInfoWindow();
  console.log(privateInfoWindow);
})

