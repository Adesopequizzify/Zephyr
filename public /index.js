import { auth, signInWithGoogle, signInWithFacebook, displayUserInfo } from './auth.js';
import { startFarming, claimRewards, checkFarmingProgress } from './game.js';
import { updateTimer, showNotification } from './ui.js';

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
    } else {
      document.getElementById('popup').style.display = 'flex';
    }
  });

  document.getElementById('google-signin').addEventListener('click', signInWithGoogle);
  document.getElementById('facebook-signin').addEventListener('click', signInWithFacebook);

  showNotification('Page has been reloaded!');
});