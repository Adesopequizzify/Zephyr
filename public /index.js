// index.js

import { auth, signInWithGoogle, signInWithFacebook, displayUserInfo, setupUserListener } from './auth.js';
import { startFarming, claimRewards, checkFarmingProgress } from './game.js';
import { updateTimer, showNotification, closeSignInPopup } from './ui.js';

document.addEventListener("DOMContentLoaded", function() {
  const startFarmingBtn = document.getElementById("start-farming-btn");
  const claimBtn = document.getElementById("claim-btn");

  startFarmingBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (user) {
      await startFarming(user);
    }
  });

  claimBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (user) {
      await claimRewards(user);
    }
  });

  auth.onAuthStateChanged(user => {
    if (user) {
      displayUserInfo(user);
      closeSignInPopup(); // Close the popup if the user is already signed in
      setupUserListener(user.uid); // Set up real-time listener for user data
    } else {
      document.getElementById('popup').style.display = 'flex';
    }
  });

  document.getElementById('google-signin').addEventListener('click', signInWithGoogle);
  document.getElementById('facebook-signin').addEventListener('click', signInWithFacebook);

  showNotification('Page has been reloaded!');
});