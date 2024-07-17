// game.js

import { db } from './firebase.js';
import { doc, updateDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { showNotification, updateUserUI } from './ui.js';

const ROUND_DURATION = 7 * 60 * 60; // 7 hours in seconds
const REWARDS_PER_ROUND = 2500; // Fixed reward per round
const MAX_DAILY_CLAIMS = 3; // Maximum claims per day

let farmingInterval = null;

async function startFarming(user) {
  const userDoc = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userDoc);
  const userData = userSnapshot.data();

  // Check if the previous round's reward has been claimed
  if (userData.roundProgress >= ROUND_DURATION && userData.dailyAirdropClaims < MAX_DAILY_CLAIMS) {
    showNotification('Please claim your reward before starting a new round.');
    return;
  }

  // UI Elements and initial setup
  const progressContainer = document.querySelector('.progress-container');
  const farmingAmountSpan = document.querySelector('.farming-amount');
  const timeSpan = document.querySelector('.time');
  const startFarmingBtn = document.getElementById('start-farming-btn');
  const claimBtn = document.getElementById('claim-btn');

  let roundProgress = 0;
  const sessionStart = new Date();
  const currentTime = new Date();

  showNotification('Started farming!');

  // Show progress bar and relevant elements
  progressContainer.style.display = 'block';
  farmingAmountSpan.parentElement.style.display = 'block';
  timeSpan.parentElement.style.display = 'block';

  // Update userData for UI and start interval
  userData.farming = true;
  userData.roundProgress = roundProgress;
  updateUserUI(userData);

  // Hide start button, show claim button if round is complete
  startFarmingBtn.style.display = 'none';
  claimBtn.style.display = roundProgress >= ROUND_DURATION ? 'block' : 'none';

  // Start farming interval
  farmingInterval = setInterval(async () => {
    roundProgress += 1;

    // Calculate farmingAmount and update UI
    const farmingAmount = ((roundProgress / ROUND_DURATION) * REWARDS_PER_ROUND).toFixed(3); // Display 3 decimal places
    farmingAmountSpan.textContent = `Farming: ${farmingAmount} ZPH`;

    // Update Firestore with current session and farming amount
    await updateDoc(userDoc, {
      roundProgress: roundProgress,
      farmingAmount: farmingAmount,
      session: new Date().toISOString(),
    });

    // Check if round completed
    if (roundProgress >= ROUND_DURATION) {
      clearInterval(farmingInterval);
      showNotification('Farming round completed!');

      // Update userData for UI (roundProgress remains the same)
      userData.farming = false;
      updateUserUI(userData); // Update UI after Firestore update
    }
  }, 1000);
}

async function claimRewards(user) {
  const userDoc = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userDoc);

  if (!userSnapshot.exists()) {
    console.error('User document not found');
    return;
  }

  const userData = userSnapshot.data();

  // Check if the user has reached the daily claim limit and round is complete
  if (userData.dailyAirdropClaims >= MAX_DAILY_CLAIMS) {
    showNotification('You have reached the maximum number of daily claims.');
    return;
  }

  if (userData.roundProgress < ROUND_DURATION) {
    showNotification('The round is not yet complete. Please wait.');
    return;
  }

  const newBalance = userData.balance + REWARDS_PER_ROUND;
  const newDailyClaims = (userData.dailyAirdropClaims || 0) + 1;

  await updateDoc(userDoc, {
    balance: newBalance,
    roundProgress: 0,
    dailyAirdropClaims: newDailyClaims,
    lastClaimTimestamp: serverTimestamp(), // Record the claim time
  });

  showNotification('Claimed successfully!');
  updateUserUI({ ...userData, balance: newBalance, dailyAirdropClaims: newDailyClaims });

  // Reset the progress bar after claiming
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    progressFill.style.width = '0%';
  }
}

async function checkFarmingProgress(user) {
  const userDoc = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userDoc);

  if (!userSnapshot.exists()) {
    console.error('User document not found');
    return;
  }

  const userData = userSnapshot.data();
  let { roundProgress, session, lastClaimTimestamp } = userData;

  if (!session) {
    console.error('Session not found for user');
    return;
  }

  const currentTime = new Date();
  const sessionStart = new Date(session);
  const elapsedTime = (currentTime - sessionStart) / 1000;

  // Check if a new day has started since the last claim
  if (lastClaimTimestamp) {
    const lastClaimDate = lastClaimTimestamp.toDate();
    if (!isSameDay(lastClaimDate, currentTime)) {
      // Reset daily claims at the start of a new day
      await updateDoc(userDoc, { dailyAirdropClaims: 0 });
      userData.dailyAirdropClaims = 0;
    }
  }

  // Update progress based on elapsed time
  roundProgress += elapsedTime;
  roundProgress = Math.min(roundProgress, ROUND_DURATION); // Cap at ROUND_DURATION

  // If round progress exceeds duration, reset it
  if (roundProgress >= ROUND_DURATION) {
    roundProgress = ROUND_DURATION; // Set to ROUND_DURATION instead of 0 to prevent multiple claim checks
    showNotification('Farming round completed!');

    // Show claim button if the user hasn't reached the daily limit
    const claimBtn = document.getElementById('claim-btn');
    claimBtn.style.display = userData.dailyAirdropClaims < MAX_DAILY_CLAIMS ? 'block' : 'none';
  }

  // Update user document with current session and progress
  await updateDoc(userDoc, {
    roundProgress: roundProgress,
    session: currentTime.toISOString(),
  });

  // Read updated data after Firestore update
  const updatedUserSnapshot = await getDoc(userDoc);
  const updatedUserData = updatedUserSnapshot.data();

  // Calculate farming amount based on updated roundProgress
  const farmingAmount = ((updatedUserData.roundProgress / ROUND_DURATION) * REWARDS_PER_ROUND).toFixed(3);

  // Call the updateProgressUI function with updated farmingAmount
  updateProgressUI(updatedUserData.roundProgress, farmingAmount); // Update UI with farmingAmount
}

function isSameDay(date1, date2) {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
}

// Update progress UI helper function
function updateProgressUI(roundProgress, farmingAmount) {
  const progressFill = document.querySelector('.progress-fill');
  const progressContainer = document.querySelector('.progress-container');
  const claimBtn = document.getElementById('claim-btn');
  const startFarmingBtn = document.getElementById('start-farming-btn');
  const farmingAmountSpan = document.querySelector('.farming-amount');
  const farmingAmountText = document.querySelector('.farming-amount');

  if (roundProgress >= ROUND_DURATION) {
    progressFill.style.width = '100%'; // Fill progress bar completely
    claimBtn.style.display = 'block'; // Show claim button
    startFarmingBtn.style.display = 'none'; // Hide start farming button
  } else {
    const progressWidth = (roundProgress / ROUND_DURATION) * 100;
    progressFill.style.width = `${progressWidth}%`; // Update progress bar width
    claimBtn.style.display = 'none'; // Hide claim button
    startFarmingBtn.style.display = 'none'; // Hide start farming button during progress
  }

  // Show/hide progress container based on round progress
  if (roundProgress > 0) {
    progressContainer.style.display = 'block';
  } else {
    progressContainer.style.display = 'none';
  }

  // Update the farming amount text
  farmingAmountSpan.textContent = `Farming: ${farmingAmount} ZPH`;
}

export { startFarming, claimRewards, checkFarmingProgress, ROUND_DURATION, MAX_DAILY_CLAIMS };