document.addEventListener("DOMContentLoaded", function() {
  const farmingAmount = document.querySelector(".farming-amount");
  const startFarmingBtn = document.getElementById("start-farming-btn");
  const claimBtn = document.getElementById("claim-btn");
  const balanceSpan = document.querySelector(".balance");
  const timeContainer = document.querySelector(".time-container .time");

  const mainContentContainer = document.getElementById('main-content-container');
  const taskContentContainer = document.getElementById('task-content-container');
  const homeTab = document.getElementById('home-tab');
  const taskTab = document.getElementById('task-tab');

  let initialBalance = 5000;
  let farmingReward = 1500;
  let countdownTime = 3600; // 1 hour in seconds

  function updateTimer() {
    let hours = Math.floor(countdownTime / 3600);
    let minutes = Math.floor((countdownTime % 3600) / 60);
    let seconds = countdownTime % 60;
    timeContainer.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  startFarmingBtn.addEventListener("click", () => {
    startFarmingBtn.style.display = "none"; // Hide the Start Farming button
    farmingAmount.style.display = "block"; // Show the farming amount
    farmingAmount.textContent = `Farming: 0 ZPH`; // Reset farming amount text

    // Create progress bar
    const progressContainer = document.createElement("div");
    progressContainer.classList.add("progress-container");
    const progressFill = document.createElement("div");
    progressFill.classList.add("progress-fill");
    progressContainer.appendChild(progressFill);
    farmingAmount.appendChild(progressContainer); // Append to farmingAmount

    // Start countdown timer
    const countdownInterval = setInterval(() => {
      countdownTime--;
      updateTimer();

      // Update progress bar
      let progressPercentage = ((3600 - countdownTime) / 3600) * 100;
      progressFill.style.width = `${progressPercentage}%`;

      // Update farming amount
      let currentFarmingAmount = (farmingReward * progressPercentage / 100).toFixed(2);
      farmingAmount.textContent = `Farming: ${currentFarmingAmount} ZPH`;
      farmingAmount.appendChild(progressContainer); // Re-append to keep structure

      // When countdown reaches 0
      if (countdownTime <= 0) {
        clearInterval(countdownInterval);
        progressContainer.remove();
        claimBtn.style.display = "block"; // Show Claim button
        farmingAmount.textContent = `Farming: ${farmingReward.toFixed(2)} ZPH`; // Final farming amount
        countdownTime = 3600; // Reset countdown time for the next farming session
      }
    }, 1000); // Update every second
  });

  claimBtn.addEventListener("click", () => {
    initialBalance += farmingReward;
    balanceSpan.textContent = `${initialBalance.toFixed(2)} ZPH`;
    claimBtn.style.display = "none";
    startFarmingBtn.style.display = "block"; // Show the Start Farming button again
    farmingAmount.style.display = "none"; // Hide the farming amount
  });

  homeTab.addEventListener('click', function() {
    mainContentContainer.style.display = 'flex';
    taskContentContainer.style.display = 'none';
    homeTab.classList.add('active');
    taskTab.classList.remove('active');
  });

  taskTab.addEventListener('click', function() {
    mainContentContainer.style.display = 'none';
    taskContentContainer.style.display = 'flex';
    homeTab.classList.remove('active');
    taskTab.classList.add('active');
  });

  updateTimer(); // Initialize the timer display
});