// index.js

import { doc, updateDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { auth, signInWithGoogle, signInWithFacebook, displayUserInfo, setupUserListener } from './auth.js';
import { checkFarmingProgress, startFarming, claimRewards } from './game.js';
import { updateUserUI, showNotification, closeSignInPopup } from './ui.js';

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

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      displayUserInfo(user);
      closeSignInPopup(); // Close the popup if the user is already signed in
      await setupUserListener(user.uid); // Set up real-time listener for user data
      await checkFarmingProgress(user); // Check farming progress after authentication
    } else {
      document.getElementById('popup').style.display = 'flex';
    }
  });

  document.getElementById('google-signin').addEventListener('click', signInWithGoogle);
  document.getElementById('facebook-signin').addEventListener('click', signInWithFacebook);

  showNotification('Page has been reloaded!');
});