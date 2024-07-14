import { firebaseConfig } from './firebaseConfig.js'; // Update the path if necessary
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js"; // Import Firebase Auth providers

document.addEventListener("DOMContentLoaded", function() {
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

        showNotification('Started farming!'); // Notification for starting farming

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

        showNotification('Claimed successfully!'); // Notification for claiming
    });

    homeTab.addEventListener('click', function() {
        mainContentContainer.style.display = 'flex';
        taskContentContainer.style.display = 'none';
        friendsContentContainer.style.display = 'none';
        homeTab.classList.add('active');
        taskTab.classList.remove('active');
        friendsTab.classList.remove('active');
    });

    taskTab.addEventListener('click', function() {
        mainContentContainer.style.display = 'none';
        taskContentContainer.style.display = 'flex';
        friendsContentContainer.style.display = 'none';
        homeTab.classList.remove('active');
        taskTab.classList.add('active');
        friendsTab.classList.remove('active');
    });

    friendsTab.addEventListener('click', function() {
        mainContentContainer.style.display = 'none';
        taskContentContainer.style.display = 'none';
        friendsContentContainer.style.display = 'flex';
        homeTab.classList.remove('active');
        taskTab.classList.remove('active');
        friendsTab.classList.add('active');
    });

    updateTimer(); // Initialize the timer display

    // Firebase Authentication
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const userInfoContainer = document.querySelector('.user-info-container');

    // Check if user is authenticated on page load
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            displayUserInfo(user);
        } else {
            // No user is signed in, show sign-in popup
            openPopup();
        }
    });

    // Google Sign-In
    document.getElementById('google-signin').addEventListener('click', () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                displayUserInfo(user);
                closePopup();
            })
            .catch((error) => {
                console.error('Error signing in with Google:', error);
            });
    });

    // Facebook Sign-In
    document.getElementById('facebook-signin').addEventListener('click', () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                displayUserInfo(user);
                closePopup();
            })
            .catch((error) => {
                console.error('Error signing in with Facebook:', error);
            });
    });

    function displayUserInfo(user) {
        // Display user information in the user-info-container
        userInfoContainer.innerHTML = `<p>Welcome, ${user.displayName}</p>`;
    }

    function closePopup() {
        document.getElementById('popup').style.display = 'none';
    }

    // Function to open the popup (for demonstration purposes)
    function openPopup() {
        document.getElementById('popup').style.display = 'flex';
    }

    // Notification Popup
    const notificationPopup = document.getElementById('notification-popup');
    const closeNotificationBtn = document.querySelector('.close-notification-btn');
    const notificationMessage = document.getElementById('notification-message');

    // Function to show the notification popup with a message
    function showNotification(message) {
        notificationMessage.textContent = message;
        notificationPopup.style.display = 'block';

        // Auto-hide the notification after 3 seconds
        setTimeout(() => {
            notificationPopup.style.display = 'none';
        }, 3000);
    }

    // Event listener to close the notification when clicking the close button
    closeNotificationBtn.addEventListener('click', () => {
        notificationPopup.style.display = 'none';
    });

    // Trigger the notification popup on page load
    showNotification('Page has been reloaded!');
});