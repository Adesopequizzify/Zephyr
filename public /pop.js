document.addEventListener('DOMContentLoaded', () => {
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