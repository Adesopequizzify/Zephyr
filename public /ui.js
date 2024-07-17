// ui.js

const farmingAmount = document.querySelector(".farming-amount");
const startFarmingBtn = document.getElementById("start-farming-btn");
const claimBtn = document.getElementById("claim-btn");
const balanceSpan = document.querySelector(".balance");
const timeContainer = document.querySelector(".time-container .time");
const mainContentContainer = document.getElementById('main-content-container');
const taskContentContainer = document.getElementById('task-content-container');
const friendsContentContainer = document.getElementById('friends-content-container');
const homeTab = document.getElementById('home-tab');
const taskTab = document.getElementById('task-tab');
const friendsTab = document.getElementById('friends-tab');
const progressFill = document.querySelector('.progress-fill'); // Add this line to access the progress bar

function updateTimer(countdownTime) {
  const hours = String(Math.floor(countdownTime / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((countdownTime % 3600) / 60)).padStart(2, '0');
  const seconds = String(countdownTime % 60).padStart(2, '0');
  timeContainer.textContent = `${hours}:${minutes}:${seconds}`;
}

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

function closeSignInPopup() {
  const popup = document.getElementById('popup');
  popup.style.display = 'none';
}

function updateUserUI(userData) {
  balanceSpan.textContent = `${userData.balance} ZPH`;
  farmingAmount.textContent = `Farming: ${userData.farmingAmount || 0} ZPH`;

  // Adjust UI based on farming state
  if (userData.farming) {
    startFarmingBtn.style.display = 'none'; // Hide start farming button
    claimBtn.style.display = userData.roundProgress >= ROUND_DURATION ? 'block' : 'none'; // Show claim button if round completed
    progressFill.parentElement.style.display = 'block'; // Show progress bar container

    // Update progress bar width based on round progress
    const progressWidth = (userData.roundProgress / ROUND_DURATION) * 100;
    progressFill.style.width = `${progressWidth}%`;
  } else {
    startFarmingBtn.style.display = 'block'; // Show start farming button
    claimBtn.style.display = 'none'; // Hide claim button
    progressFill.parentElement.style.display = 'none'; // Hide progress bar container
  }
}

export { updateTimer, showNotification, closeSignInPopup, updateUserUI };