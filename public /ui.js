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

export { updateTimer, showNotification };