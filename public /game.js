import { db } from './firebase.js';
import { doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { showNotification } from './ui.js';

const ROUND_DURATION = 7 * 60 * 60; // 7 hours in seconds
const REWARDS_PER_LEVEL = [2500, 4000, 5000, 8333.33, 16666.67];

async function startFarming(user) {
  const userDoc = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userDoc);
  if (!userSnapshot.exists()) return;

  const userData = userSnapshot.data();
  const level = userData.level;
  const reward = REWARDS_PER_LEVEL[level - 1];

  // Farming logic...
  showNotification('Started farming!');
  // Continue farming logic...
}

async function claimRewards(user) {
  const userDoc = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userDoc);
  if (!userSnapshot.exists()) return;

  const userData = userSnapshot.data();
  const newBalance = userData.balance + REWARDS_PER_LEVEL[userData.level - 1];

  await updateDoc(userDoc, {
    balance: newBalance,
    roundProgress: 0,
  });

  showNotification('Claimed successfully!');
}

async function checkFarmingProgress(user) {
  // Logic to check and update farming progress
}

export { startFarming, claimRewards, checkFarmingProgress };