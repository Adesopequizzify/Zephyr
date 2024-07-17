import { db } from './firebase.js';
import { doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { showNotification, updateTimer } from './ui.js';

const ROUND_DURATION = 7 * 60 * 60; // 7 hours in seconds
const REWARDS_PER_LEVEL = [2500, 5000, 10000, 15000, 20000]; // Rewards per level

let farmingInterval = null; // Interval to track farming progress

async function startFarming(user) {
  const userDoc = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userDoc);

  if (!userSnapshot.exists()) {
    console.error('User document not found');
    return;
  }

  const userData = userSnapshot.data();
  const level = userData.level;
  const rewardPerRound = REWARDS_PER_LEVEL[level - 1];
  let roundProgress = userData.roundProgress || 0;
  const sessionStart = userData.session ? new Date(userData.session) : new Date();

  const currentTime = new Date();
  const elapsedTime = (currentTime - sessionStart) / 1000;

  // Calculate progress from elapsed time
  roundProgress += elapsedTime;
  roundProgress = Math.min(roundProgress, ROUND_DURATION); // Cap at ROUND_DURATION

  // Start farming logic with simulated progress
  showNotification('Started farming!');
  updateTimer(ROUND_DURATION - roundProgress); // Update UI with remaining time

  // Animate progress bar (example: increase width over time)
  let progressWidth = (roundProgress / ROUND_DURATION) * 100;
  const progressFill = document.querySelector('.progress-fill');
  progressFill.style.width = `${progressWidth}%`;

  // Show progress bar
  progressFill.parentElement.style.display = 'block';

  // Hide start farming button
  const startFarmingBtn = document.getElementById('start-farming-btn');
  startFarmingBtn.style.display = 'none';

  // Update UI and start interval for real-time updates
  farmingInterval = setInterval(() => {
    roundProgress += 1;
    updateTimer(ROUND_DURATION - roundProgress); // Update remaining time UI

    // Update progress bar width dynamically
    progressWidth = (roundProgress / ROUND_DURATION) * 100;
    progressFill.style.width = `${progressWidth}%`;

    // Check if round completed
    if (roundProgress >= ROUND_DURATION) {
      clearInterval(farmingInterval);
      roundProgress = 0; // Reset round progress after completion
      showNotification('Farming round completed!');
      progressFill.parentElement.style.display = 'none'; // Hide progress bar

      // Show claim button after farming round completion
      const claimBtn = document.getElementById('claim-btn');
      claimBtn.style.display = 'block';
    }
  }, 1000);

  // Update user document with current session and progress
  await updateDoc(userDoc, {
    roundProgress: roundProgress,
    session: currentTime.toISOString(),
  });
}

async function claimRewards(user) {
  const userDoc = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userDoc);

  if (!userSnapshot.exists()) {
    console.error('User document not found');
    return;
  }

  const userData = userSnapshot.data();
  const newBalance = userData.balance + REWARDS_PER_LEVEL[userData.level - 1];

  await updateDoc(userDoc, {
    balance: newBalance,
    roundProgress: 0, // Reset round progress after claiming
  });

  showNotification('Claimed successfully!');
}

async function checkFarmingProgress(user) {
  const userDoc = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userDoc);

  if (!userSnapshot.exists()) {
    console.error('User document not found');
    return;
  }

  const userData = userSnapshot.data();
  let { roundProgress, session } = userData;

  if (!session) {
    console.error('Session not found for user');
    return;
  }

  const currentTime = new Date();
  const sessionStart = new Date(session);
  const elapsedTime = (currentTime - sessionStart) / 1000;

  // Update progress based on elapsed time
  roundProgress += elapsedTime;
  roundProgress = Math.min(roundProgress, ROUND_DURATION); // Cap at ROUND_DURATION

  // If round progress exceeds duration, reset it
  if (roundProgress >= ROUND_DURATION) {
    roundProgress = 0;
    showNotification('Farming round completed!');
    const progressFill = document.querySelector('.progress-fill');
    progressFill.parentElement.style.display = 'none'; // Hide progress bar

    // Show start farming button again
    const startFarmingBtn = document.getElementById('start-farming-btn');
    startFarmingBtn.style.display = 'block';

    // Hide claim button if shown
    const claimBtn = document.getElementById('claim-btn');
    claimBtn.style.display = 'none';
  } else {
    // Show progress bar
    const progressFill = document.querySelector('.progress-fill');
    progressFill.parentElement.style.display = 'block';

    // Update UI with remaining time if still farming
    updateTimer(ROUND_DURATION - roundProgress); // Update remaining time UI

    // Start interval for real-time updates
    farmingInterval = setInterval(() => {
      roundProgress += 1;
      updateTimer(ROUND_DURATION - roundProgress); // Update remaining time UI

      // Check if round completed
      if (roundProgress >= ROUND_DURATION) {
        clearInterval(farmingInterval);
        roundProgress = 0; // Reset round progress after completion
        showNotification('Farming round completed!');
        const progressFill = document.querySelector('.progress-fill');
        progressFill.parentElement.style.display = 'none'; // Hide progress bar

        // Show start farming button again
        const startFarmingBtn = document.getElementById('start-farming-btn');
        startFarmingBtn.style.display = 'block';

        // Hide claim button if shown
        const claimBtn = document.getElementById('claim-btn');
        claimBtn.style.display = 'none';
      }
    }, 1000);
  }

  // Update user document with current session and progress
  await updateDoc(userDoc, {
    roundProgress: roundProgress,
    session: currentTime.toISOString(),
  });
}

export { startFarming, claimRewards, checkFarmingProgress };