// ui.js
import { startFarming, claimRewards, checkFarmingProgress, ROUND_DURATION, MAX_DAILY_CLAIMS } from './game.js';

const balanceSpan = document.querySelector(".balance");
const levelSpan = document.querySelector('.level');
const mainContentContainer = document.getElementById('main-content-container');
const taskContentContainer = document.getElementById('task-content-container');
const friendsContentContainer = document.getElementById('friends-content-container');
const homeTab = document.getElementById('home-tab');
const taskTab = document.getElementById('task-tab');
const friendsTab = document.getElementById('friends-tab');
const startFarmingBtn = document.getElementById('start-farming-btn');
const claimBtn = document.getElementById('claim-btn');
const progressContainer = document.querySelector('.progress-container');
const farmingAmountSpan = document.querySelector('.farming-amount');
const timeSpan = document.querySelector('.time');

// Tab switching logic
homeTab.addEventListener('click', () => showTab('home'));
taskTab.addEventListener('click', () => showTab('task'));
friendsTab.addEventListener('click', () => showTab('friends'));

function showTab(tabName) {
  mainContentContainer.style.display = tabName === 'home' ? 'flex' : 'none';
  taskContentContainer.style.display = tabName === 'task' ? 'flex' : 'none';
  friendsContentContainer.style.display = tabName === 'friends' ? 'flex' : 'none';
  homeTab.classList.toggle('active', tabName === 'home');
  taskTab.classList.toggle('active', tabName === 'task');
  friendsTab.classList.toggle('active', tabName === 'friends');
}

// Notification popup logic
const notificationPopup = document.getElementById('notification-popup');
const closeNotificationBtn = document.querySelector('.close-notification-btn');
const notificationMessage = document.getElementById('notification-message');

closeNotificationBtn.addEventListener('click', () => {
  notificationPopup.style.display = 'none';
});

function showNotification(message) {
  notificationMessage.textContent = message;
  notificationPopup.style.display = 'block';
  setTimeout(() => notificationPopup.style.display = 'none', 3000);
}

// Close sign-in popup 
function closeSignInPopup() {
  const popup = document.getElementById('popup');
  popup.style.display = 'none';
}

// Update UI elements based on user data
async function updateUserUI(userData) {
  // Update balance
  balanceSpan.textContent = `${userData.balance} ZPH`;

  // Update level
  const level = userData.level || 1; // Default to level 1 if not available
  levelSpan.textContent = `Lvl ${level}`;

  // Adjust UI based on farming state
  if (userData.farming) {
    startFarmingBtn.style.display = 'none';
    claimBtn.style.display = 'none';

    // Show the progress bar container and text elements
    progressContainer.style.display = 'block';
    farmingAmountSpan.parentElement.style.display = 'block';
    timeSpan.parentElement.style.display = 'block';

    // Start or update farming progress if user is farming
    await startFarming(userData);
  } else {
    startFarmingBtn.style.display = 'block';
    claimBtn.style.display = userData.roundProgress >= ROUND_DURATION && userData.dailyAirdropClaims < MAX_DAILY_CLAIMS ?
      'block' : 'none';

    // Hide the progress bar container and text elements
    progressContainer.style.display = 'none';
    farmingAmountSpan.parentElement.style.display = 'none';
    timeSpan.parentElement.style.display = 'none';
  }
}

// Event listeners for buttons
startFarmingBtn.addEventListener('click', () => startFarming());
claimBtn.addEventListener('click', () => claimRewards());

// Exported constants and functions
export { showNotification, closeSignInPopup, updateUserUI, MAX_DAILY_CLAIMS, ROUND_DURATION };